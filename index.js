const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//data base
const studentDb = [];

//model for students

class StudentsModel {
  constructor(name, age, gen, email) {
    this.name = name;
    this.age = age;
    this.gen = gen;
    this.email = email;
  }

  save() {
    studentDb.push(this);
    return this;
  }

  static all() {
    return studentDb;
  }
}

// controllers

//create student controller
const createNewStudent = (req, res) => {
  const { name, age, gen, email } = req.body;

  const newStudent = new StudentsModel(name, age, gen, email);
  newStudent.save();

  res.send({ message: "successful", student: newStudent });
};

// retrive all students
const getAllStudents = (req, res) => {
  const getStudents = StudentsModel.all();

  res.send({ message: "successful", student: getStudents });
};

//middlewares

app.use(bodyParser.json());

app.post("/create", createNewStudent);
app.get("/get-all-students", getAllStudents);

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
