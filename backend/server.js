const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Football@1316",
  database: "Think_Money",
});

app.post("/register", (req, res) => {
  const { username, user_id, email, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while registering." });
    }

    const sql =
      "INSERT INTO user (`username`, `user_id`, `email`, `password`) VALUES (?)";
    const values = [username, user_id, email, hashedPassword];

    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY") {
          if (
            err.message.includes("user_id") &&
            err.message.includes("email")
          ) {
            return res.json("user_id and email");
          } else if (err.message.includes("user_id")) {
            return res.json("user_id");
          } else if (err.message.includes("email")) {
            return res.json("email");
          }
        }
        return res.json({ error: "An error occurred while registering." });
      }
      return res.json(data);
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE `user_id` = ?";
  db.query(sql, [req.body.user_id], (err, data) => {
    if (err) {
      console.error("Error retrieving user:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while logging in." });
    }
    if (data.length > 0) {
      // User found, now compare passwords
      const hashedPassword = data[0].password;
      bcrypt.compare(req.body.password, hashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res
            .status(500)
            .json({ error: "An error occurred while logging in." });
        }
        if (result) {
          // Passwords match, login successful
          return res.json("Success");
        } else {
          // Passwords do not match, login failed
          return res.json("Fail");
        }
      });
    } else {
      // User not found
      return res.json("Fail");
    }
  });
});

app.post("/gold", (req, res) => {
  const sql =
    "INSERT INTO gold (`user_id`, `p_price`, `gram`, `c_price`, `value`) VALUES (?)";
  const rows = [user_id, p_price, gram, c_price, value];

  db.query(sql, [rows], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ error: "An error occurred while registering." });
    }
    return res.json(data);
  });
});

app.listen(8080, () => {
  console.log("listening");
});
