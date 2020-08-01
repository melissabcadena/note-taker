const notes = require('./db/db.json')
const express = require('express');
var uniqid = require('uniqid');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// create static routes
app.use(express.static('public'));

function filterByQuery (query, notesArray) {
    let filteredResults = notesArray;
    if(query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if(query.text) {
        filteredResults = filteredResults.filter( note => note.text === query.text);
    }
    return filteredResults;
}

// search by specific ID
function findById(id, notes) {
    const result = notes.filter(note => note.id === id)[0];
    return result;
}

function createNewNote(body, notesArray) {
    const newNote = body;

    // pushes the new note to the notes array
    notesArray.push(newNote);

    //updates the notes db w the new note 
    fs.writeFileSync(path.join(__dirname, './db/db.json'),
    JSON.stringify(notes, null, 2)
    );

    return newNote;
}

function validateNote(note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !=='string') {
        return false;
    }
    return true;
}

// route to notes db
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results)
    }
    res.json(results);
});

//  route to param name
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    res.json(result);
})

app.post('/api/notes', (req, res) => {
    // set random id
    req.body.id = uniqid();

    // ensure new note has title and text
    if(!validateNote(req.body)) {
        res.status(400).send("Please ensure you've added a Note Title and Note Text.");
    } else {
        // add note to json file and notes array in this function
        const newNote = createNewNote(req.body, notes)
        res.json(newNote);
    }
});


// route to index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// route to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.listen(PORT, () => {
    console.log(`API Server now on port ${PORT}!`);
})