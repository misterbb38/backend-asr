// backend/models/Meeting.js
const mongoose = require("mongoose");

const SubItemSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const AgendaItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  subItems: [SubItemSchema]
});

const MeetingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  agenda: [AgendaItemSchema]
});

module.exports = mongoose.model("Meeting", MeetingSchema);
