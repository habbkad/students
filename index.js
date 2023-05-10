const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const studentModel = require("./studentSchema");
const userModel = require("./usermodel");
const bcrypt = require("bcryptjs");
const app = express();

mongoose.connect(
  "mongodb+srv://codetrain:zZfS318E8O6m6UzM@cluster0.kfmkaxh.mongodb.net/?retryWrites=true&w=majority"
);

//controller
//create student controller
const createNewStudent = (req, res) => {
  const { name, age, gen, email } = req.body;

  const model = new studentModel({ name, age, gen, email });

  model.save();

  res.send({ message: "successful", student: model });
};

// retrive all students
const getAllStudents = async (req, res, next) => {
  const model = await studentModel.find();

  res.send({ message: "successful", student: model });
};
// update all students
const updateStudents = async (req, res, next) => {
  // const model = await studentModel.findByIdAndUpdate(
  //   "6449030a571a8c22b92801b5",
  //   { age: 24 }
  // );
  const model = await studentModel.findOneAndUpdate(
    { name: "Esther " },
    { age: 24 }
  );

  res.send({ message: "successful", student: model });
};
// delete all students
const deleteStudents = async (req, res, next) => {
  // const model = await studentModel.findByIdAndRemove(
  //   "64490496c7bac07e2c9664e6"
  // );
  const model = await studentModel.findByIdAndDelete(
    "6449030a571a8c22b92801b5"
  );

  res.send({ message: "successful", student: model });
};

//user controller
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const user = new userModel({ name, email, password: hash });
  await user.save();
  res.send({ message: "successful", data: user });
};

//middlewares

app.use(bodyParser.json());

//routes for crud
app.post("/create", createNewStudent);
app.get("/get-all-students", getAllStudents);
app.put("/update-students", updateStudents);
app.delete("/delete-students", deleteStudents);

//routes for auth
app.post("/user", createUser);

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
