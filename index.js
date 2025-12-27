const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Model
const TodoSchema = new mongoose.Schema({
    task: String,
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes
app.get("/api/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/api/todos", async (req, res) => {
    const todo = new Todo({ task: req.body.task });
    await todo.save();
    res.json(todo);
});

app.put("/api/todos/:id", async (req, res) => {
    const updated = await Todo.findByIdAndUpdate(req.params.id, { task: req.body.task }, { new: true });
    res.json(updated);
});

app.delete("/api/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
