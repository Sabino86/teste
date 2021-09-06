const moment = require('moment');
const { isMoment } = require('moment');
const testServer = require('./testServer');

let clientIdCreditCard;
let clientIdDebitCard;
const hoje = moment();

describe('Server', () => {
  it('POST Validate new credit card transaction creation successfully', async () => {
    const response = await testServer.post('/api/v1/transactions')
      .send({
        amount: 10000,
        description: 'Transação de compra de carro',
        payment_method: 'credit_card',
        card_number: '5535592291159662',
        card_holder_name: 'Jose C Teste',
        card_expiration_date: '05/23',
        card_cvv: '123',
        client_id: 11,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toBe('Transação de compra de carro');
    expect(response.body.payment_method).toBe('credit_card');
    expect(response.body.card_number).toBe('9662');
    expect(response.body.card_holder_name).toBe('Jose C Teste');
    expect(response.body.card_expiration_date).toBe('05/23');
    expect(response.body.card_cvv).toBe('123');
    expect(response.body.client_id).toBe(11);
    clientIdCreditCard = response.body.client_id;
  });

  it('POST Validate new debit card transaction creation successfully', async () => {
    const response = await testServer.post('/api/v1/transactions')
      .send({
        amount: 1000,
        description: 'Transação de compra de bicicleta',
        payment_method: 'debit_card',
        card_number: '5535592291159662',
        card_holder_name: 'Jose C Teste',
        card_expiration_date: '05/23',
        card_cvv: '123',
        client_id: 12,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toBe('Transação de compra de bicicleta');
    expect(response.body.payment_method).toBe('debit_card');
    expect(response.body.card_number).toBe('9662');
    expect(response.body.card_holder_name).toBe('Jose C Teste');
    expect(response.body.card_expiration_date).toBe('05/23');
    expect(response.body.card_cvv).toBe('123');
    expect(response.body.client_id).toBe(11);
    clientIdDebitCard = response.body.client_id;
  });

  it('GET /credit transactions must respond with status "waiting_funds", payment_date (D+30) and 5% fee', async () => {
    const response = await testServer.get(`/api/v1/balance?clientId=${clientIdCreditCard}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('waiting_funds');
    expect(response.body.fee).toBe(500);
    expect(response.body.payment_date).toBe(hoje.add(30, 'days'));
  });

  it('GET /debit transactions must respond with status "paid", payment_date (D+0) and 3% fee', async () => {
    const response = await testServer.get(`/api/v1/balance?clientId=${clientIdDebitCard}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('paid');
    expect(response.body.fee).toBe(30);
    expect(response.body.payment_date).toBe(hoje);
  });

  it('POST Validate new credit card transaction creation with invalid clientID', async () => {
    const response = await testServer.post('/api/v1/transactions')
      .send({
        amount: 1234,
        description: 'Transação de compra de carro',
        payment_method: 'credit_card',
        card_number: '5535592291159662',
        card_holder_name: 'Jose C Teste',
        card_expiration_date: '05/23',
        card_cvv: '132',
        client_id: 9999999999999999999999999,
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST Validate new debit card transaction creation with invalid clientID', async () => {
    const response = await testServer.post('/api/v1/transactions')
      .send({
        amount: 1234,
        description: 'Transação de compra de carro',
        payment_method: 'debit_card',
        card_number: '5535592291159662',
        card_holder_name: 'Jose C Teste',
        card_expiration_date: '05/23',
        card_cvv: '123',
        client_id: 9999999999999999999999999,
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST /transactions should respond with error 500', async () => {
    const response = await testServer.post('/api/v1/transactions')
      .send({
        amount: 1234,
        description: 'Transação de compra de carro',
        payment_method: 'cartao de credito',
        card_number: '4242424242424242',
        card_holder_name: 'Eu, eu mesmo e Irene',
        card_expiration_date: 'meu aniversário',
        card_cvv: 'cvc',
        client_id: Number.MAX_SAFE_INTEGER,
      });

    expect(response.statusCode).toBe(500);
  });

  it('POST /balance should respond with error 500', async () => {
    const response = await testServer.put('/api/v1/balance')
      .send({
        query:
          `Payable.update({ 
          include: [{
            model: Transaction,
            where: {
              client_id: 1,
            },
          }]
        })`,
      });

    expect(response.statusCode).toBe(500);
  });
});
