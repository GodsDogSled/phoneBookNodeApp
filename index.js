const express = require('express')
const app = express()
app.use(express.json())

const contacts = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})
app.get('/', (request, response) => {
  response.send("<h1>Welcome to the phone book backed API</h1>")
})
app.get('/info', (request, response) => {
  response.send(`<h100>The phone book has info for ${contacts.length} people</h100><br>${new Date()}`)
})
app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)