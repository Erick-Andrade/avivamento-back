const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
  next();
});

// Conexão MongoDB
const uri = process.env.MONGODB_URI;
let db;

async function conectarDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('acampamento');
    console.log('✅ MongoDB conectado!');
    return db;
  } catch (error) {
    console.error('❌ Erro MongoDB:', error);
    throw error;
  }
}

// Inicializar controllers
let inscricaoController = null;

async function inicializar() {
  try {
    console.log('🔄 Inicializando sistema...');
    
    // Conectar banco
    const database = await conectarDB();
    
    // Carregar classes
    const InscricaoRepository = require('./repositories/InscricaoRepository');
    const InscricaoController = require('./controllers/InscricaoController');
    
    // Criar instâncias
    const inscricaoRepository = new InscricaoRepository(database);
    inscricaoController = new InscricaoController(inscricaoRepository);
    
    console.log('✅ Controladores inicializados');
    
    // ROTAS
    
    // 1. Rota de teste
    app.get('/api/teste', (req, res) => inscricaoController.teste(req, res));
    
    // 2. CADASTRAR (Rota 1)
    app.post('/api/cadastrar', (req, res) => inscricaoController.cadastrar(req, res));
    
    // 3. LISTAR TUDO (Rota 2)
    app.get('/api/listar', (req, res) => inscricaoController.listarTudo(req, res));
    
    // Rota de saúde
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        mongoDB: 'connected',
        rotas: 2
      });
    });
    
    // Rota raiz
    app.get('/', (req, res) => {
      res.json({
        message: '🎪 API Acampamento 2026',
        rotas: [
          'POST /api/cadastrar',
          'GET /api/listar',
          'GET /api/teste'
        ]
      });
    });
    
    // Rota não encontrada
    app.use((req, res) => {
      res.status(404).json({
        error: 'Rota não encontrada',
        rota: req.originalUrl,
        rotas_disponiveis: ['/api/cadastrar', '/api/listar', '/api/teste']
      });
    });
    
    console.log('✅ Sistema inicializado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar:', error);
    throw error;
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 3001;

inicializar()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🎉 API rodando em http://localhost:${PORT}`);
      console.log(`📝 Teste: http://localhost:${PORT}/api/teste`);
      console.log(`📤 Cadastrar: POST http://localhost:${PORT}/api/cadastrar`);
      console.log(`📋 Listar: GET http://localhost:${PORT}/api/listar\n`);
    });
  })
  .catch(error => {
    console.error('💥 Falha ao iniciar:', error);
  });

module.exports = app;