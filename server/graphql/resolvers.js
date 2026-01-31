import User from '../models/User.js'
import Report from '../models/Report.js'
import { processReport } from '../services/aiService.js'
import {
  hashPassword,
  comparePassword,
  generateToken,
  getUserFromToken,
} from '../utils/auth.js'

const generateReferenceNumber = (city, description) => {
  const cityCode = city.slice(0, 4).toUpperCase()
  const firstWord = description.split(' ')[0].slice(0, 10)
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  return `${cityCode}-${firstWord}-${randomNum}`
}

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')

      return await User.findById(user.userId)
    },

    reports: async (parent, { city, userId }, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')

      const query = {}

      if (user.role === 'civilian') {
        query.createdBy = user.userId
      }

      if (city) query.city = city
      if (userId) query.createdBy = userId

      return await Report.find(query)
        .populate('createdBy')
        .populate('resolution.completedBy')
        .populate('notes.author')
        .sort({ createdAt: -1 })
    },

    report: async (parent, { id }, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')

      return await Report.findById(id)
        .populate('createdBy')
        .populate('resolution.completedBy')
        .populate('notes.author')
    },
  },

  Mutation: {
    signup: async (parent, { name, email, password, role, city }) => {
      const existingUser = await User.findOne({ email })
      if (existingUser) throw new Error('Email already registered')

      const hashedPassword = await hashPassword(password)
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        city,
      })
      await user.save()

      const token = generateToken(user._id, user.role)

      return {
        token,
        user,
      }
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) throw new Error('Invalid credentials')

      const isValid = await comparePassword(password, user.password)
      if (!isValid) throw new Error('Invalid credentials')

      const token = generateToken(user._id, user.role)

      return {
        token,
        user,
      }
    },

    createReport: async (
      parent,
      { description, location, city, civilianContact, images },
      context
    ) => {
      const user = getUserFromToken(context)
      // Allow anonymous reporting - user ID will be null if not logged in

      const aiResult = await processReport(description, location, city)
      const referenceNumber = generateReferenceNumber(city, description)

      const newReport = new Report({
        referenceNumber,
        originalDescription: description,
        city,
        location,
        civilianContact,
        images,
        createdBy: user ? user.userId : null,
        department: aiResult.department,
        status: 'submitted',
        aiAnalysis: {
          cleanedText: aiResult.cleanedText,
          severity: aiResult.severity,
          duplicateConfidence: 0,
          thoughts: aiResult.thoughts,
        },
      })

      await newReport.save()
      return await Report.findById(newReport._id).populate('createdBy')
    },

    updateReportStatus: async (parent, { id, status, department }, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')
      if (user.role !== 'council') throw new Error('Not authorized')

      const report = await Report.findByIdAndUpdate(
        id,
        { $set: { status, department } },
        { new: true }
      )
        .populate('createdBy')
        .populate('resolution.completedBy')
        .populate('notes.author')

      return report
    },

    resolveReport: async (parent, { id, notes }, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')
      if (user.role !== 'council') throw new Error('Not authorized')

      const report = await Report.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'resolved',
            resolution: {
              completedBy: user.userId,
              notes,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      )
        .populate('createdBy')
        .populate('resolution.completedBy')
        .populate('notes.author')

      return report
    },

    addReportNote: async (parent, { reportId, text }, context) => {
      const user = getUserFromToken(context)
      if (!user) throw new Error('Not authenticated')

      const report = await Report.findByIdAndUpdate(
        reportId,
        {
          $push: {
            notes: {
              text,
              author: user.userId,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      )
        .populate('createdBy')
        .populate('resolution.completedBy')
        .populate('notes.author')

      return report
    },
  },
}

export default resolvers
