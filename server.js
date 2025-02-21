// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Meeting = require("./models/Meeting");

const app = express();
app.use(cors());
app.use(express.json());

// Variables d'environnement
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connexion à MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

/** ROUTES (CRUD) **/
// GET toutes les réunions
app.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 });
    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET une réunion par ID
app.get("/meetings/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: "Introuvable" });
    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST créer une réunion
app.post("/meetings", async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    const saved = await newMeeting.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Données invalides" });
  }
});

// PUT mettre à jour une réunion
app.put("/meetings/:id", async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // renvoie le doc mis à jour
    );
    if (!updated) return res.status(404).json({ error: "Introuvable" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Données invalides" });
  }
});

// DELETE supprimer une réunion
app.delete("/meetings/:id", async (req, res) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Introuvable" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur express écoutant sur le port ${PORT}`);
});
