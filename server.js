import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/tasks" //API
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUndefinedTopology: true })
mongoose.Promise = Promise

const Task = mongoose.model('Task', { 
  text: {
    type: String,
    required: true, //validation rule
    minlength: 5  //validation rule
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/tasks', async (req, res) => {
const tasks = await Task.find().sort({createdAt: 'desc'}).limit(20).exec();
res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  //Retrive the information sent by the client to our API endpoint
  const {text, complete} = req.body;
  //Use our mongoose model to create the database entry
  const task = new Task({text, complete});
  
  try {
    // Success
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({message: 'Could not save task to the Database', error: err.errors});
  }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
