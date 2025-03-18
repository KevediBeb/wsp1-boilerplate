import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import logger from "morgan"
import bcrypt from "bcrypt"
import session from "express-session"
import bodyParser from "body-parser"
import pool from "db.js"


const app = express()
const port = 3000


const saltRounds = 10;
const myPlaintextPassword = 'test';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
	// här får vi nu tag i lösenordets hash i variabeln hash
	console.log(hash)
})


nunjucks.configure("views", {
  autoescape: true,
  express: app,
})


app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.use(logger("dev"))

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))


app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  res.render("index.njk",
    { title: "Test", message: "Funkar?", views: req.session.views }
  )
})

app.post('/', async (req, res) => {
  console.log(req.body)
  const {name, password} = req.body
  const [result] = await pool
    .promise()
    .query(`SELECT * FROM user WHERE user.name = user.name`)
  
  console.log(result)
  res.redirect("/")
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})