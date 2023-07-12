const express = require("express");
const session = require("express-session");
const passport = require("passport");

require("./auth");

function isLoggedIn(req, res, next) {
  //   console.log(/req/, req.user);
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(
  session({ secret: "keepitsecret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`<a href="/auth/google">Authenticate with google</a>`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send(`<h1>Some thing went wrong..!</h1>`);
});

app.get("/home", isLoggedIn, (req, res) => {
  res.send(`<h1>Welcome...!</h1>
  <p1>Hello ${req.user.displayName} </p>
  `);
});

app.use("logout", (req, res) => {
  req.logout();
  req.send("Goodbye..!");
});

app.listen(3000, () => console.log("Running on port: 3000"));
