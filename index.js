require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')


// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('contact', function (request, response)  {
  const { name, number } = request.body

  return JSON.stringify({
    name,
    number,
  })
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))



// Home
app.get('/', (request, response) => {
  response.send('<h1>Upon you peace</h1>')
})


// Info
app.get('/info', (request, response, next) => {
  const time = new Date()

  Person
    .countDocuments({})
    .then(persons => {
      response.send(`
            <p>
                Phonebook has info for ${persons} people
            </p>
            <p>
             ${time}
            </p>
            `)
    })
    .catch(error => next(error))
})


// All person
app.get('/api/persons', (request, response, next) => {
  Person
    .find({}).then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})



// Single person
app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// modified a person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// receiving data
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body


  const person = new  Person({
    name,
    number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:  'unknow endpoint' })
}
app.use(unknownEndpoint)


// handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // In all other error situations, the middleware passes the error forward to the default Express error handler.
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})