class Inscricao {
  constructor(dados) {
    this.nome = dados.nome;
    this.telefone = dados.telefone;
    this.observacoes = dados.observacoes || '';
    this.igreja = dados.igreja;
    this.precisaDeColchao = Boolean(dados.precisaDeColchao);
    this.idade = parseInt(dados.idade) || 18;
    this.quantosDias = parseInt(dados.quantosDias) || 1;
    this.formaDePagamento = parseInt(dados.formaDePagamento) || 0;
    this.total = parseInt(dados.total) || 0;
    this.pago = Boolean(dados.pago || false);
    this.criadoEm = new Date();
  }

  validar() {
    return null;

  }

  toJSON() {
    return {
      nome: this.nome,
      telefone: this.telefone,
      observacoes: this.observacoes,
      igreja: this.igreja,
      precisaDeColchao: this.precisaDeColchao,
      idade: this.idade,
      quantosDias: this.quantosDias,
      formaDePagamento: this.formaDePagamento,
      total: this.total,
      pago: this.pago,
      criadoEm: this.criadoEm
    };
  }
}

module.exports = Inscricao;