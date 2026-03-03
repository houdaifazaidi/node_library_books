// Import express
const express = require("express");
const app = express();

// Import Book model
require("./Book");

// Import mongoose
const mongoose = require("mongoose");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(function(req, res, next){
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//     next()
// })


// Connect to MongoDB
const uri = "mongodb+srv://houdaifazaidi04_db_user:xmWwoqrHcc1SakEo@cluster0.pufzrga.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection failed", err));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to books service");
});

// Get Book model
const Book = mongoose.model("Book");

// Add new book
app.post("/book", (req, res) => {

  const newBook = {
    title: req.body.title,
    author: req.body.author,
    publisher: req.body.publisher
  };

  const book = new Book(newBook);

  book.save()
    .then(() => {
      console.log("Book created");
      res.json({ message: "New book added" });
    })
    .catch(err => {
      res.status(500).json({ error: "Error creating book" });
    });

});

// Get all books
app.get("/books", (req, res) => {

  Book.find()
    .then(books => {
      res.json({ books: books });
    })
    .catch(err => {
      res.status(500).json({ error: "Error fetching books" });
    });

});

// Get book by id
app.get("/books/:id", (req, res) => {

  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        res.json({ book: book });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Invalid ID" });
    });

});

// Delete book by id
app.delete("/books/:id", (req, res) => {

  Book.findByIdAndDelete(req.params.id)
    .then((deletedBook) => {

      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json({ message: "Book deleted" });

    })
    .catch(err => {
      res.status(500).json({ error: "Error deleting book" });
    });

});

// Start server
// app.listen(1111, () => {
//   console.log("Server running on port 1111");
// });

module.exports = app