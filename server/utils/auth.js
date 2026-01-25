import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'thehood-secret-key'

export const hashPassword = async password => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = token => {
  return jwt.verify(token, JWT_SECRET)
}

export const getUserFromToken = context => {
  const authHeader = context.req.headers.authorization
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  try {
    return verifyToken(token)
  } catch (err) {
    return null
  }
}
