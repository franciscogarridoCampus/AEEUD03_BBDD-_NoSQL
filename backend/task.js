const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tecnologia: {
    type: String,
    trim: true
    // Ejemplo: "Java", "JS", "Python"
  },
  estado: {
    type: Boolean,
   
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

// Fuerza el nombre de la colección: "tasks"
module.exports = mongoose.model('Task', taskSchema, 'tasks');
