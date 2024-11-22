const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  // Create the new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Clear any existing session
  req.session = null;

  // Automatically log in the user after signup
  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId);

  // Redirect to home page of the newly signed-up user
  return res.redirect("/home");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password",
    });

  // Clear any existing session
  req.session = null;

  // Set up new session for the logged-in user
  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId);

  // Redirect to home page of the logged-in user
  return res.redirect("/home");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
