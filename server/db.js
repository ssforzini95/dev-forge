/**
 * In-memory user store — replace with a real database (e.g. PostgreSQL, MongoDB)
 * for anything beyond local development.
 */

const bcrypt = require('bcryptjs')

const users = []

// Seed a demo account on startup
;(async () => {
  const hash = await bcrypt.hash('demo1234', 10)
  users.push({ id: 1, name: 'Demo User', email: 'demo@devforge.io', passwordHash: hash })
})()

module.exports = {
  findByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  create: async ({ name, email, password }) => {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = { id: users.length + 1, name, email, passwordHash }
    users.push(user)
    return user
  },
}
