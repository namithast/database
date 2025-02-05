const express = require('express')
const app = express()
var cors=require('cors')
app.use(cors({
    origin:'http://localhost:5173'
}))


const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config('./.env');
const dbPassword=process.env.DB_PASSWORD
console.log(dbPassword);
mongoose.connect(`mongodb+srv://stnamitha2003:${dbPassword}@cluster0.hys25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)


.then(res=>{
    console.log("db connected successfully");
    
})
.catch(err=>{
console.log("db connection failed")

})
const TaskSchema = new mongoose.Schema({
    task: String,
    isCompleted:Boolean
  });
  const Task = mongoose.model('task', TaskSchema);
app.use(express.json())
let tasks=[
   
]
app.get('/', (req, res) => { 
  Task.find() 
  .then(taskItems=>{
    console.log(taskItems);
  res.json({taskItems,count:taskItems.length})
  })
  .catch(err=>{
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  })
 
})
//const { v4: uuidv4 } = require('uuid');
app.post('/', (req, res) => { 
  const task = req.body.task;  // Get the task from request body
  Task.create({ task: task, isCompleted: false })  // Store in MongoDB
      .then(() => {
          res.json({ message: "Task added successfully" }); // Send success response
      })
      .catch((err) => {
          console.error("Error adding task:", err);
          res.status(500).json({ message: "Error adding task" });
      });
});
app.delete("/task/:id", async (req, res) => {
  try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Deleted", deletedTask });
  } catch (err) {
      res.status(500).json({ message: "Error deleting task", error: err });
  }
});

app.put('/task/:id', async (req, res) => {
  try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, { task: req.body.task }, { new: true });
      if (!updatedTask) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
      res.status(500).json({ message: "Error updating task", error: err });
  }
});
    
    
app.listen(3007)