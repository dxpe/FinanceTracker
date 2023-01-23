const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "finance"
})

app.listen(3001, () => {
  console.log(`Server listening on 3001`);
});

app.post("/sign-up", (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    db.query("INSERT INTO users (username, email, password) VALUES (?,?,?)", [username, email, password], (err, result) => {
        console.log(err);
    })
});

app.post("/sign-in", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ message: "Niepoprawne dane"})
        }
    })
});

app.post("/add-transaction", (req, res) => {
    const name = req.body.name
    const date = req.body.date
    const value = req.body.value
    const userid = req.body.userid
    db.query("INSERT INTO expenses (userid, name, date, value) VALUES (?,?,?,?)", [userid, name, date, value], (err, result) => {
        if (err) {
            console.log(err);
        }
    })
});

app.get("/transactions/:id", (req, res) => {
    const userId = req.params.id
    db.query("SELECT * FROM expenses where userid = ?", [userId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    })
});