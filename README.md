# Desafio Test Engineer Pagar.me (v1.0)

Aqui na Pagar.me acreditamos que qualidade é responsabilidade de todos envolvidos no desenvolvimento, por isso nosso objetivo é disseminar o conhecimento de qualidade e trabalhar pareando com os desenvolvedores para dar insights e com ferramentas e boas práticas.

Nesse desafio, queremos que você avalie a qualidade dessa implementação e sugira mudanças e melhorias conforme descrevemos com mais detalhes nas [Instruções](#instruções). Esse repositório foi criado especialmente para você, fique a vontade para submeter seu Pull Request com as sugestões e adicionar issues.

> Importante: Leia com atenção o Contexto, os Requisitos e o Formato de Avaliação

## Instruções

1. Para fazer um bom desafio, considere que esse código será colocado em produção e irá impactar milhares de clientes e que você é parte do time que está fazendo essa entrega
2. No tópico [Como executar o projeto](#como-executar-o-projeto) você encontra as informações sobre como iniciar a API e como executar os testes automatizados que já estão desenvolvidos nesse repositório. Depois de iniciar a API você já consegue acessá-la no endereço `http://localhost:3000/`.

### Questões para resolver:

1. Agora que você consegue acessar a API, confira as regras de negócio definidas para essa implementação no tópico [Requisitos](#requisitos) e verifique se o que foi desenvolvido atende a essas regras. Caso você encontre bugs, reporte através da parte de Issues desse mesmo repositório. Tente ser o mais claro possível nesses reports para que os membros do seu time consigam entender.
2. Escreva, em formato Gherkin, os cenários que melhor atendem os [Requisitos](#requisitos) listados para que o time tenha um melhor entendimento dos mesmos e que possam iniciar uma cultura de BDD.
3. Se algum requisito não estiver claro, fique à vontade para questioná-lo abrindo uma Issue para cada dúvida.
4. Nesse repositório temos alguns testes já implementados mas não sabemos se a cobertura está suficiente, o que você acha? Os nomes dos cenários de teste estão claros? As validações feitas são suficientes? Submeta um [Pull Request](https://docs.github.com/pt/github/collaborating-with-issues-and-pull-requests/about-pull-requests) com implementações de melhoria em relação aos testes existentes. Aqui vamos avaliar seu conhecimento em automação de testes.
    > **Importante:** nesse repositório temos alguns testes unitários e integração, fique à vontade para questionar se esses testes fazem sentido, se foram escritos na camada certa ou sugerir novos tipos de teste (como validações de segurança por exemplo). Caso você não se sinta confortável em criar os testes utilizando javascript, crie uma nova pasta no repositório e adicione os testes na linguagem que lhe for mais conveniente. Não esqueça de adicionar as instruções sobre como executar esses testes.

### Questões bônus:

Esses dois tópicos são itens que contarão como pontos bônus na avaliação do desafio:

1. Outra coisa muito importante quando falamos de qualidade de aplicações são as métricas de análise estática como lint e cobertura de testes. Se possível, implemente a análise dessas métricas de forma automatizada para que possamos ter uma visão melhor de como está a qualidade do nosso código e ter uma visão do nosso report de resultado dos testes!
2. Propor um fluxo de pipeline que tenha as verificações de qualidade que implementamos aqui, porque de nada adianta termos esses testes e executarmos só na nossa máquina, certo? Você pode criar uma [Issue](https://github.com/pagarme/desafio-qa-template/issues) com a resposta desse tópico, ou se se sentir confortável, implementar o mesmo utilizando qualquer ferramenta de CI open-source.

## Contexto

Em sua essência um PSP tem duas funções muito importantes:

1. Permitir que nossos clientes processem transações ("cash-in")
2. Efetuar os pagamentos dos recebíveis para os nossos clientes ("cash-out")

No Pagar.me, nós temos duas entidades que representam essas informações:

* `transactions`: que representam as informações da compra, dados do cartão, valor, etc
* `payables`: que representam os recebíveis que pagaremos ao cliente

## Requisitos

Abaixo estão as regras de negócio da implementação que foi feita. Você deve usar isso como base para entender se implementação faz o que deveria da maneira correta.

1. O serviço deve processar transações, recebendo as seguintes informações:
    * Valor da transação
    * Descrição da transação. Ex: `'Smartband XYZ 3.0'`
    * Método de pagamento (`debit_card` ou `credit_card`)
    * Número do cartão
    * Nome do portador do cartão
    * Data de validade do cartão
    * Código de verificação do cartão (CVV)
2. O serviço deve retornar uma lista das transações já criadas
3. Como o número do cartão é uma informação sensível, o serviço só pode armazenar e retornar os 4 últimos dígitos do cartão.
4. O serviço deve criar os recebíveis do cliente (`payables`), com as seguintes regras:
    1. Se a transação for feita com um cartão de débito:
    * O payable deve ser criado com status = `paid` (indicando que o cliente já recebeu esse valor)
    * O payable deve ser criado com a data de pagamento (payment_date) = data da criação da transação (D+0).
    1. Se a transação for feita com um cartão de crédito:
    * O payable deve ser criado com status = `waiting_funds` (indicando que o cliente vai receber esse dinheiro no futuro)
    * O payable deve ser criado com a data de pagamento (payment_date) = data da criação da transação + 30 dias (D+30).
5. No momento de criação dos payables também deve ser descontado a taxa de processamento (que chamamos de `fee`) do cliente. Ex: se a taxa for 5% e o cliente processar uma transação de R$100,00, ele só receberá R$95,00. Considere as seguintes taxas:
    * 3% para transações feitas com um cartão de débito
    * 5% para transações feitas com um cartão de crédito
6. O serviço deve prover um meio de consulta para que o cliente visualize seu saldo com as seguintes informações:
    * Saldo `available` (disponível): tudo que o cliente já recebeu (payables `paid`)
    * Saldo `waiting_funds` (a receber): tudo que o cliente tem a receber (payables `waiting_funds`)

## Como executar o projeto

Você vai precisar de:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Se estiver no Linux/Mac

Para iniciar o server e conseguir acessar via localhost:

```shell
make server
```
Para executar todos os testes:

```shell
make tests
```

### Se estiver no Windows

Para iniciar o server e conseguir acessar via localhost:

```shell
docker-compose up server
```
Para executar todos os testes:

```shell
docker-compose run tests
```

### Chamando a API

Depois disso você deve ser capaz de criar uma nova transação, por exemplo:

```shell
curl --location --request POST 'http://localhost:3000/api/v1/transactions' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": 1234,
    "description": "Transação de compra de carro",
    "payment_method": "cartao de credito",
    "card_number": "4242424242424242",
    "card_holder_name": "Eu, eu mesmo e Irene",
    "card_expiration_date": "meu aniversário",
    "card_cvv": "cvc",
    "client_id": 12344
}'
```

Você pode ver todas as rotas disponíveis em [src/server/index.js](./src/server/index.js).


## Avaliação

1. Quando você terminar o desafio, você precisa **confirmar para a gente no email** ou thread que você estiver trocando com nosso time de recrutamento. Só iremos olhar seu desafio após essa confirmação no email.
    > **Nota:** quando você der o ok no email, você perderá acesso ao desafio. Fazemos isso por uma limitação técnica. Se você quiser manter o que fez de desafio, recomendamos imprimir a página do review como PDF.
1. Vamos te chamar para conversar e discutir sobre o seu desafio.
1. Iremos discutir sobre os pontos que você anotou no review e se aprofundar em alguns pontos específicos. 
1. Vamos aproveitar o contexto do desafio para discutir possíveis cenários alternativos, pontos de melhoria que você enxergou, como você faria determinados pontos diferentes, etc.
1. Somos bem cuidadosos com nossos reviews no dia-a-dia e vamos te avaliar com essa barra em mente. Vamos te perguntar se você colocaria esse código em produção.
1. Lembre que isso vai ser uma troca e que deveria ser uma experiência de aprendizado para os dois lados.
1. Boa sorte :)
