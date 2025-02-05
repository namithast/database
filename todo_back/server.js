const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config('./.env')
app.use(cors({ origin: 'http://localhost:5174' }))
app.use(express.json())
const dbPassword=process.env.DB_PASSWORD
console.log(dbPassword);

mongoose.connect(`mongodb+srv://stnamitha2003:${dbPassword}@cluster0.hys25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("db connected successfully"))
    .catch(() => console.log("db connection failed"))

const TaskSchema = new mongoose.Schema({
    task: String,
    isCompleted: Boolean
})

const Task = mongoose.model('task', TaskSchema)

app.get('/', (req, res) => {
    Task.find()
        .then(taskItems => res.json({ taskItems, count: taskItems.length }))
})

app.post('/', (req, res) => {
    console.log(req.body)
    Task.create({ task: req.body.task, isCompleted: false })
        .then(() => res.json("success"))
})

app.delete("/task/:id", (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(() => res.send("deleted"))
})

app.put('/task/:id', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { task: req.body.task }, { new: true })
        .then(updatedTask => {
            if (updatedTask) res.json({ message: "Task updated successfully", task: updatedTask })
        })
})

app.listen(3007)


