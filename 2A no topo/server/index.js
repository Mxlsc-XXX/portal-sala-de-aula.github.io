const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/trabalhos', require('./routes/trabalhos'));
app.use('/api/datas', require('./routes/datas'));
app.use('/api/apps', require('./routes/apps'));
app.use('/api/guias', require('./routes/guias'));
app.use('/api/planilhas', require('./routes/planilhas'));
app.use('/api/avisos', require('./routes/avisos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 