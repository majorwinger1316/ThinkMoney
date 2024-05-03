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
  host: "firstinstance.c3eaeyu0oxbr.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "administrator",
  database: "thinkmoneydb",
  connectTimeout: 20000, // Example timeout value in milliseconds
  timeout: 20000, // Example timeout value in milliseconds
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

app.post("/gold", async (req, res) => {
  const { user_id, p_price, gram, c_price, value, returns } = req.body;

  if (!user_id || !p_price || !gram || !c_price || !value || !returns) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert data into the "gold" table
    db.query(
      "INSERT INTO gold (user_id, p_price, gram, c_price, value, returns) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, p_price, gram, c_price, value, returns]
    );

    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data into database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/stock", (req, res) => {
  const sql = "SELECT stock_name FROM stock";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/currentPrice/:stockName", (req, res) => {
  const stockName = req.params.stockName;
  const sql = "SELECT price FROM stock WHERE stock_name = ?";

  db.query(sql, [stockName], (err, results) => {
    if (err) {
      console.error("Error fetching current price:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        res.status(200).json({ currentPrice: results[0].price }); // Corrected here
      } else {
        res.status(404).json({ error: "Stock not found" });
      }
    }
  });
});

app.post("/equity", (req, res) => {
  const {
    user_id,
    stock_name,
    p_price,
    quantity,
    c_price,
    invest_amt,
    curr_val,
    returns,
  } = req.body;

  // Check if all required fields are present
  if (
    !user_id ||
    !stock_name ||
    !p_price ||
    !quantity ||
    !c_price ||
    !invest_amt ||
    !curr_val ||
    !returns
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO equity (user_id, stock_name, p_price, quantity, c_price, invest_amt, curr_value, returns) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    stock_name,
    p_price,
    quantity,
    c_price,
    invest_amt,
    curr_val,
    returns,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error inserting equity data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ message: "Equity data inserted successfully" });
  });
});

app.get("/investment/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query to calculate total gold investment and return for the given user ID
  const goldQuery = `SELECT SUM(value) AS total_investment, SUM(returns) AS total_return FROM gold WHERE user_id = ?`;

  // Query to calculate total equity investment and return for the given user ID
  const equityQuery = `SELECT SUM(invest_amt) AS total_investment, SUM(returns) AS total_return FROM equity WHERE user_id = ?`;

  // Execute both queries asynchronously
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(goldQuery, [userId], (error, goldResults) => {
        if (error) reject(error);
        else {
          console.log("Gold Investment Data:", goldResults[0]);
          resolve(goldResults[0]);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.query(equityQuery, [userId], (error, equityResults) => {
        if (error) reject(error);
        else {
          console.log("Equity Investment Data:", equityResults[0]);
          resolve(equityResults[0]);
        }
      });
    }),
  ])
    .then(([goldData, equityData]) => {
      // Send gold investment data if available, else send equity investment data
      if (
        goldData.total_investment !== null ||
        goldData.total_return !== null
      ) {
        res.json({ gold: goldData });
      } else if (
        equityData.total_investment !== null ||
        equityData.total_return !== null
      ) {
        res.json({ equity: equityData });
      } else {
        res.json({
          message: "No investment data found for the specified user",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching investment data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
