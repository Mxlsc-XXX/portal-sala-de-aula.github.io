const express = require('express');
const router = express.Router();
const Trabalho = require('../models/Trabalho');

// Listar todos os trabalhos
router.get('/', async (req, res) => {
  try {
    const trabalhos = await Trabalho.find().sort({ dataEntrega: 1 });
    res.json(trabalhos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo trabalho
router.post('/', async (req, res) => {
  const trabalho = new Trabalho({
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    dataEntrega: req.body.dataEntrega,
    materia: req.body.materia,
    anexos: req.body.anexos,
    criadoPor: req.body.criadoPor
  });

  try {
    const novoTrabalho = await trabalho.save();
    res.status(201).json(novoTrabalho);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar trabalho
router.put('/:id', async (req, res) => {
  try {
    const trabalho = await Trabalho.findById(req.params.id);
    if (!trabalho) {
      return res.status(404).json({ message: 'Trabalho não encontrado' });
    }

    Object.assign(trabalho, req.body);
    const trabalhoAtualizado = await trabalho.save();
    res.json(trabalhoAtualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar trabalho
router.delete('/:id', async (req, res) => {
  try {
    const trabalho = await Trabalho.findById(req.params.id);
    if (!trabalho) {
      return res.status(404).json({ message: 'Trabalho não encontrado' });
    }

    await trabalho.remove();
    res.json({ message: 'Trabalho removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 