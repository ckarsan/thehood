const express = require('express')
const router = express.Router()
const Report = require('../models/Report')
const { processReport } = require('../services/aiService')

// POST /api/reports - Create a new report (Civilian)
router.post('/', async (req, res) => {
  try {
    const { description, location, civilianContact, images, city } = req.body

    if (!city) {
      return res.status(400).json({ success: false, message: 'City is required' })
    }

    // 1. Initial save (optional, or wait for AI) - decided to process first
    // 2. Call AI Service
    const aiResult = await processReport(description, location, city)

    // 3. Create Report in DB
    const newReport = new Report({
      originalDescription: description,
      city,
      location,
      civilianContact, // Optional
      images,
      department: aiResult.department,
      status: 'Not Started',
      aiAnalysis: {
        cleanedText: aiResult.cleanedText,
        severity: aiResult.severity,
        duplicateConfidence: 0, // Placeholder for future deduplication logic
        thoughts: aiResult.thoughts,
      },
    })

    const savedReport = await newReport.save()
    res.status(201).json({ success: true, report: savedReport })
  } catch (err) {
    console.error('Error creating report:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET /api/reports - Get all reports (Council Dashboard)
// Supports filtering by ?city=Name
router.get('/', async (req, res) => {
  try {
    const { city } = req.query
    const query = city ? { city } : {}
    
    const reports = await Report.find(query).sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// PATCH /api/reports/:id - Update status (Council)
router.patch('/:id', async (req, res) => {
  try {
    const { status, department } = req.body
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: { status, department } },
      { new: true }
    )
    res.json(report)
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
