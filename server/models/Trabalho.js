const mongoose = require('mongoose');

const trabalhoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  dataEntrega: {
    type: Date,
    required: true
  },
  materia: {
    type: String,
    required: true
  },
  anexos: [{
    nome: String,
    url: String
  }],
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trabalho', trabalhoSchema); 