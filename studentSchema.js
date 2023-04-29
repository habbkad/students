const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gen: {
    type: Number,
  },
  email: {
    type: String,
  },
});

const studentmodel = mongoose.model("students", studentSchema);

module.exports = studentmodel;
