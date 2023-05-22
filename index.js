const express = require("express");
const app = express();
require("express-ws")(app)
const nunjucks = require("nunjucks");
const socket = require("./routes/socket");
const login = require("./routes/login");
const signup = require("./routes/signup");
const logout = require("./routes/logout");
const api = require("./routes/api");
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");


nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/login", login);
app.use("/signup", signup);
app.use("/socket", auth(), socket);
app.use("/logout", auth(), logout);
app.use("/api", api);

app.get("/", auth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
