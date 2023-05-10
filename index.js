const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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

//login user
const logInUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.send({ message: "unsuccessful", data: "Pls signup to login" });
  }
  const isPassword = bcrypt.compareSync(password, user.password);

  if (!isPassword) {
    return res.send({
      message: "unsuccessful",
      data: "Pls enter valid credentials",
    });
  }
  var token = jwt.sign({ id: user._id }, "i love coding");

  res
    .cookie("token", token, { expiresIn: "1h" })
    .send({ message: "successfull", data: { name: user.name } });
};

//protected route
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.send({ message: "unsuccessful", data: "Pls login" });
  }
  //decode jwt token form cookies
  const decoded = jwt.verify(token, "i love coding");
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return res.send({ message: "unsuccessful", data: "User not found" });
  }
  next();
};
//middlewares

app.use(bodyParser.json());
app.use(cookieParser());

//routes for crud
app.post("/create", protect, createNewStudent);
app.get("/get-all-students", getAllStudents);
app.put("/update-students", protect, updateStudents);
app.delete("/delete-students", protect, deleteStudents);

//routes for auth
app.post("/user", createUser);
app.post("/login", logInUser);

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
