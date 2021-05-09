const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Ebrima Faal",
        "number": "220-9998765"
    },
    {
        "id": 2,
        "name": "Cherno Faal",
        "number": "220-8887654"
    },
    {
        "id": 3,
        "name": "Binta Dibba",
        "number": "220-7776543"
    },
    {
        "id": 4,
        "name": "Lamin Barrow",
        "number": "220-6665432"
    },
    {
        "id": 5,
        "name": "Ebrima Touray",
        "number": "220-5554321"
    }
]


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
    const noOfPersons = persons.length;
    const time = new Date();

    response.send(`
        <p>
            Phonebook has info for ${noOfPersons} people
        </p>
        <p>
            ${time}
        </p>
    `)
})


// All person
app.get('/api/persons', (request, response) => {
    response.json(persons);
})



// Single person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
       return response.json(person); 
    } else {
        return response.status(404).end() 
    }
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

// receiving data
app.post('/api/persons', (request, response) => {
    const body = request.body
    const isPerson = persons.some(person => person.name === body.name)
   
    if (isPerson) {
        return response.status(400).json({ 
            error: `${body.name} already exists in the phonebook` 
        })
    }

    if (!body.name ) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }


    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);

    response.json(person)
})




const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})