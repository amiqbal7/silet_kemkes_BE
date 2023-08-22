const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const koneksi = require('./config/koneksi')

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: '*'
}));
app.use(bodyParser.json());


const verivyJwt = (req, res, next) => {
  const token = req.headers["acces token"];
  if (!token) {
    return res.json("We need provide it for next time");
  } else {
    jwt.verify(token, "jwtSecretKey", (err, decoded) => {
      if (err) {
        res.json("Not Authenticated");
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/checkauth", verivyJwt, (req, res) => {
  return res.json("Authenticated");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT * FROM login WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to log in" });
      } else {
        if (result.length > 0) {
          if (password === result[0].password) {
            const id = result[0].id;
            const token = jwt.sign({ id }, "jwtSecretKey", {
              expiresIn: "5m",
            });
            const userData = {
              username: result[0].username,
            };
            res.json({ login: true, token, user: userData });
          } else {
            res.status(401).json({ message: "Wrong email or password" });
          }
        } else {
          res.status(401).json({ message: "Wrong email or password" });
        }
      }
    }
  );
});



app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
