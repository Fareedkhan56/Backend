const mongoose = require("mongoose")

mongoose.connect(`mongodb+srv://fareedkhan2504525:2504525@demo-cluster.wjmqf.mongodb.net/UsersCollection`)

const userSchema = mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
    userAge: Number
})

module.exports = mongoose.model("user", userSchema)