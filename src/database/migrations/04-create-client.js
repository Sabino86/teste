module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('client', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING,
    }
  }),
  down: queryInterface => queryInterface.dropTable('client'),
}
