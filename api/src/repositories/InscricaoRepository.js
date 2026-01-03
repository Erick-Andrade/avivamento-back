class InscricaoRepository {
  constructor(db) {
    this.collection = db.collection('inscricoes');
  }

  // Criar nova inscrição
  async criar(inscricao) {
    const documento = inscricao.toJSON();
    const resultado = await this.collection.insertOne(documento);
    
    return {
      ...documento,
      _id: resultado.insertedId
    };
  }

  // Listar todas inscrições
  async listarTudo() {
    const inscricoes = await this.collection
      .find({})
      .sort({ criadoEm: -1 })
      .toArray();
    
    return inscricoes;
  }

  // Contar total de inscrições
  async contarTotal() {
    return await this.collection.countDocuments();
  }
}

module.exports = InscricaoRepository;