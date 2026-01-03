const Inscricao = require('../models/Inscricao');

class InscricaoController {
  constructor(inscricaoRepository) {
    this.repository = inscricaoRepository;
  }

  // CADASTRAR (Rota 1)
  async cadastrar(req, res) {
    try {
      // Criar modelo
      const inscricao = new Inscricao(req.body);
      
      // Validar
      const erro = inscricao.validar();
      if (erro) {
        return res.status(400).json({
          success: false,
          error: erro
        });
      }

      // Salvar
      const resultado = await this.repository.criar(inscricao);

      res.status(201).json({
        success: true,
        message: '✅ Inscrição cadastrada com sucesso!',
        id: resultado._id,
        nome: resultado.nome,
        total: resultado.total
      });

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao cadastrar'
      });
    }
  }

  // LISTAR TUDO (Rota 2)
  async listarTudo(req, res) {
    try {
      const inscricoes = await this.repository.listarTudo();
      const total = await this.repository.contarTotal();

      res.json({
        success: true,
        total,
        inscricoes: inscricoes.map(insc => ({
          id: insc._id,
          nome: insc.nome,
          telefone: insc.telefone,
          igreja: insc.igreja,
          idade: insc.idade,
          total: insc.total,
          pago: insc.pago,
          criadoEm: insc.criadoEm
        }))
      });

    } catch (error) {
      console.error('Erro ao listar:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao listar inscrições'
      });
    }
  }

  // Rota de teste
  teste(req, res) {
    res.json({
      success: true,
      message: '🚀 API Acampamento - 2 Rotas',
      rotas: {
        cadastrar: 'POST /api/cadastrar',
        listar: 'GET /api/listar',
        teste: 'GET /api/teste'
      }
    });
  }
}

module.exports = InscricaoController;