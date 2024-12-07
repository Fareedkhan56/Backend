const express = require("express");
const app = express();

const path = require("path")
const fs = require("fs")

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    fs.readdir("./files", (err, file) => {
        res.render("index", { file: file });
    })
})

app.get("/files/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        res.render("fileView", { fileName: req.params.filename, fileData: filedata })
    })
})

app.get("/edit/:filename", (req, res) => {
    res.render("edit", { fileName: req.params.filename })
})

app.post("/edit", (req, res) => {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err) => {
        res.redirect("/")
    })
})

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.task.split(" ").join("")}.txt`, req.body.description, (err) => {
        if (err) console.log(err)
        else res.redirect("/")
    })
})

app.listen(3000)