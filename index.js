const e = require('express')
const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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








const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})