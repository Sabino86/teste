module.exports = {
  up: queryInterface => queryInterface.bulkInsert('client', [
    {
      id: 1,
      name: 'Client Number 1',
    },
    {
      id: 2,
      name: 'Cliente número 2',
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('client', {}, { truncate: true }),
}
