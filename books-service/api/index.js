// Load environment variables
require("dotenv").config();

// Import modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ ADD THIS

// Import Book model
const Book = require("../models/Book");

// Create Express app
const app = express();

/* =====================================================
   1️⃣ BASIC MIDDLEWARE
   ===================================================== */

// ✅ CORS MIDDLEWARE (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local frontend
      "https://library-micro-serveces-app.vercel.app/" // deployed frontend (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());
/* =====================================================
   2️⃣ MONGODB CONNECTION (SERVERLESS SAFE)
   ===================================================== */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected (Books Service)");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

/* =====================================================
   3️⃣ ROUTES (BOOKS SERVICE)
   ===================================================== */

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "books-service",
    status: "running",
  });
});

// Home
app.get("/", (req, res) => {
  res.send("Books Service is running");
});

// CREATE Book
app.post("/book", async (req, res) => {
  await connectDB();

  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET All Books
app.get("/books", async (req, res) => {
  await connectDB();

  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Book By ID
app.get("/books/:id", async (req, res) => {
  await connectDB();

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// DELETE Book
app.delete("/books/:id", async (req, res) => {
  await connectDB();

  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

/* =====================================================
   4️⃣ EXPORT HANDLER (VERCEL SERVERLESS)
   ===================================================== */

module.exports = app;