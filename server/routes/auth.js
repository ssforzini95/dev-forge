const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })

  const user = db.findByEmail(email)
  if (!user)
    return res.status(401).json({ message: 'Invalid credentials.' })

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match)
    return res.status(401).json({ message: 'Invalid credentials.' })

  const token = makeToken(user)
  res.json({ token, user: { name: user.name, email: user.email } })
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required.' })

  if (password.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })

  if (db.findByEmail(email))
    return res.status(409).json({ message: 'An account with this email already exists.' })

  const user = await db.create({ name, email, password })
  const token = makeToken(user)
  res.status(201).json({ token, user: { name: user.name, email: user.email } })
})

module.exports = router
