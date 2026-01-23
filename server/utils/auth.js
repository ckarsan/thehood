const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET || 'thehood-secret-key'

const hashPassword = async password => {
  return await bcrypt.hash(password, 10)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

const verifyToken = token => {
  return jwt.verify(token, JWT_SECRET)
}

const getUserFromToken = context => {
  const authHeader = context.req.headers.authorization
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  try {
    return verifyToken(token)
  } catch (err) {
    return null
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  getUserFromToken,
}
