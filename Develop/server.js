const express = require('express');
// const mysql = require('mysql2');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html') )
});

app.get('/api/notes', (req,res) => {

});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));