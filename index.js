require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')


// Middlewares
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))
app.use(cors())
app.use(express.static('build'))


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error:  'unknow endpoint'})
}

morgan.token('contact', function (request, response)  {
    const {name, number} = request.body

    return JSON.stringify({
        name,
        number,
    })
})



// let persons = [
//     {
//         "id": 1,
//         "name": "Ebrima Faal",
//         "number": "220-9998765"
//     },
//     {
//         "id": 2,
//         "name": "Cherno Faal",
//         "number": "220-8887654"
//     },
//     {
//         "id": 3,
//         "name": "Binta Dibba",
//         "number": "220-7776543"
//     },
//     {
//         "id": 4,
//         "name": "Lamin Barrow",
//         "number": "220-6665432"
//     },
//     {
//         "id": 5,
//         "name": "Ebrima Touray",
//         "number": "220-5554321"
//     }
// ]


// helper function/s
const generateId = () => {
    return `${Math.random().toString(36).substr(2, 9)}`;
}

// Home
app.get('/', (request, response) => {
    response.send('<h1>Upon you peace</h1>')
})


// Info
app.get('/info', (request, response) => {
    // const noOfPersons = persons.length
    // const time = new Date()

    // response.send(`
    //     <p>
    //         Phonebook has info for ${noOfPersons} people
    //     </p>
    //     <p>
    //         ${time}
    //     </p>
    // `)
})


// All person
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})



// Single person
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.filter(person => person.id !== id)
  
    // response.status(204).end()
})

// receiving data
app.post('/api/persons', (request, response) => {
    const {name, number} = request.body
   // const isPerson = persons.some(person => person.name === name)
   
    /* if (isPerson) {
        return response.status(400).json({ 
            error: `${name} already exists in the phonebook` 
        })
    } */

    if (name === undefined ) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if (number === undefined) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }


    const person = new  Person({
        name,
        number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
        mongoose.connection.close()
   })
})

 
app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})