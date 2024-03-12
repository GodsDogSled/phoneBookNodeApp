require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan');
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const Contact = require('./models/contact')
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

//morgan config
morgan.token('requestParams', req => JSON.stringify(req.body));
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms :requestParams';
app.use(morgan(morganFormat));



let contacts = [
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

const generateId = () => {
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})
app.get('/', (request, response) => {
  response.send("<h1>Welcome to the phone book backed API</h1>")
})

app.get('/info', (request, response) => {
  Contact.find().then(contacts => {
    response.send(`<h100>The phone book has info for ${contacts.length} people</h100><br>${new Date()}`)
  })
})

app.get('/api/contacts/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// app.post('/api/contacts', (request, response) => {

//   const body = request.body
//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }

//   const contact = new Contact({
//     name: body.name,
//     number: body.number 
//   })

//   contact.save().then(savedContact => {
//     response.json(savedContact)
//   })

// })

app.post('/api/contacts', (request, response) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
})

app.put('/api/contacts/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)