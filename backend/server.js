const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for periods (for now)
let periods = [];

// Add a new period
app.post("/api/periods", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const id = Date.now(); // simple unique ID
  const newPeriod = { id, name, startDate, endDate };
  periods.push(newPeriod);
  res.status(201).json(newPeriod);
});

// Get all periods
app.get("/api/periods", (req, res) => {
  res.json(periods);
});

// Delete a period
app.delete("/api/periods/:id", (req, res) => {
  const id = parseInt(req.params.id);
  periods = periods.filter((p) => p.id !== id);
  res.status(200).json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
