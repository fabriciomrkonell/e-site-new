module.exports = function(sequelize, DataTypes) {
  var Curriculo = sequelize.define('Curriculo', {
    nome: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    documento: {
      type: DataTypes.STRING,
      defaultValues: null
    },
    nascimento: {
      type: DataTypes.STRING
    },
    sexo: {
      type:   DataTypes.ENUM,
      values: ['Masculino', 'Feminino']
    },
    bairro: {
      type: DataTypes.STRING
    },
    cidade: {
      type: DataTypes.STRING
    },
    estado: {
      type:   DataTypes.ENUM,
      values: ['Santa Catarina', 'Paraná', 'Rio Grande do Sul']
    },
    telefone: {
      type: DataTypes.STRING
    },
    celular: {
      type: DataTypes.STRING
    },
    salarioAtual: {
      type:   DataTypes.ENUM,
      values: ['R$ 950,00 - R$ 1.100,00', 'R$ 1.100,00 - R$ 1.300,00', 'R$ 1.300,00 - R$ 1.500,00', 'R$ 1.500,00 - R$ 2.000,00', 'R$ 2.000,00 - R$ 3.000,00', 'R$ 3.000,00 - R$ 4.000,00', 'R$ 4.000,00 - R$ 5.000,00']
    },
    trabalha: {
      type:   DataTypes.ENUM,
      values: ['Sim', 'Não']
    },
    conheceuSite: {
      type:   DataTypes.ENUM,
      values: ['Google', 'Rádio', 'Jornal', 'Facebook', 'Outros']
    },
    cargo: {
      type: DataTypes.STRING
    },
    hierarquico: {
      type:   DataTypes.ENUM,
      values: ['Loja', 'Administrativo', 'Gerência', 'Liderança']
    },
    area: {
      type:   DataTypes.ENUM,
      values: ['Reposição', 'Empacotamento', 'Operação de caixa', 'Depósito', 'Açougue', 'Padaria', 'Administrativo', 'Liderança']
    },
    outrasEmpresas: {
      type: DataTypes.TEXT
    }
  })
  return Curriculo;
};