require("dotenv").config();
const express = require("express");
const cors = require("cors");

const tasksController = require("./controllers/tasksController");
const labelsController = require("./controllers/labelsController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksController);

app.use("/labels", labelsController);

module.exports = app;