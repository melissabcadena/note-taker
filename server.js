const notes = require('./db/db.json')
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const path = require('path');

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

function findById(id, notes) {
    const result = notes.filter(note => note.id === id)[0];
    return result;
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