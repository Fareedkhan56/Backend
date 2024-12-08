const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userModel = require("./models/user")
const user = require("./models/user")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/create", (req, res) => {
    let { userName, userEmail, userAge, userPassword } = req.body

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(userPassword, salt, async function (err, hash) {
            let createdUser = await userModel.create({
                userName,
                userEmail,
                userAge,
                userPassword: hash
            })

            let token = jwt.sign({ userEmail }, "secret")
            res.cookie("token", token)
            res.send(createdUser)
        });
    });
})

app.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.redirect("/")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const { userEmail, userPassword } = req.body

    let user = await userModel.findOne({ userEmail })
    if (!user) res.send("Something Went Wrong")
    else bcrypt.compare(userPassword, user.userPassword, (err, result) => {
        if (result) {
            let token = jwt.sign({ userEmail }, "secret")
            res.cookie("token", token)
            res.send("Yes You Can Login")
        }
        else res.send("No You Cant Login")
    })
})

app.listen(3000)