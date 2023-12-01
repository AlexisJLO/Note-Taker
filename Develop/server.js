const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const readNotesFromFile = () => {
  const data = fs.readFileSync(path.join(__dirname, "db", "db.json"), "utf8");
  return JSON.parse(data);
};

const writeNotesToFile = (notes) => {
  fs.writeFileSync(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(notes, null, 2)
  );
};

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const notes = JSON.parse(data);

    notes.push(newNote);

    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(newNote);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteIdToDelete = req.params.id;

  let notes = readNotesFromFile();
  notes = notes.filter((note) => note.id !== noteIdToDelete);

  writeNotesToFile(notes);

  res.sendStatus(200);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
