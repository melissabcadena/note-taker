const express = require('express');
const app = express();

const path = require('path');

// route to index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// route to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.listen(3001, () => {
    console.log(`API Server now on port 3001`);
})