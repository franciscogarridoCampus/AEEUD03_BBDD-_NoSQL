const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./task');

const app = express();
const PORT = 3000;

app.use(cors());
// Middleware para JSON
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(
  process.env.MONGO_URI + 'fullstack_db'
)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error(err));

// ---------- API REST ----------

// GET → todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// POST → crear tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// DELETE → borrar tarea por ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});
//Estados
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.estado = !task.estado; // Cambia de true a false o viceversa
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});


// Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
