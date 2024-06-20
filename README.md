<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://recetadelfuturo.com/wp-content/uploads/2023/06/uol_edtech_marca-e1687787591291.jpg" width="200" alt="Nest Logo" /></a>
</p>

<h3 align="center">
    🚧 Plataforma de gerenciamento e visualização de conteúdos 🚧
</h3>

## 📓 Desafio

Foi solicitado a criação de uma plataforma de gerenciamento e visualização de conteúdos, disponibilizando uma API para o time de front-end com os seguintes requisitos:

- Essa API não será pública e será utilizada por dois níveis de usuário: administrador e estudante;
- Os conteúdos deverão ser gerenciados (criação, atualização e deleção) somente por usuários administradores;
- Os usuários estudantes poderão apenas visualizar a listagem dos conteúdos disponibilizados na plataforma, e os detalhes específicos de cada um;
- Os conteúdos deverão ter obrigatoriamente nome, descrição, e tipo;
- Deverão ser permitidas apenas três strings no tipo do conteúdo: video, pdf ou image;
- Será necessário contabilizar as visualizações únicas dos estudantes ao acessarem os detalhes do conteúdo;
- Não é necessário criar um sistema de login ou cadastro/gerenciamento de usuários, apenas uma solução que funcione como uma camada de validação por tokens estáticos.

## 💻 Sobre o projeto

O projeto foi concebido com uma arquitetura de software híbrida que combina práticas de Domain-Driven Design, Clean Architecture, Hexagonal e N-Tier. No entanto, devido ao tamanho do desafio em termos de riqueza de domínio e funcionalidades, optei por não seguir rigidamente uma arquitetura específica, como a Clean Architecture. Isso poderia tornar o projeto mais complexo e difícil de entender do que deveria. A minha ideia é que seja de fácil entendimento para diferentes níveis de senioridade.

Foi adotada uma estrutura simples, mas que incorpora os sólidos conceitos e boas práticas de arquitetura de software. O objetivo é garantir que o projeto seja facilmente compreensível, promovendo a legibilidade do código e a clareza das funcionalidades implementadas. Além disso, busca-se baixo acoplamento, alta coesão e separação clara de responsabilidades, bem como flexibilidade e escalabilidade.

## 🛠 Tecnologias

Segui a stack da empresa:

- NodeJs com Typescript
- Framework Nest.js
- Jest para os testes
- Banco de dados Postgres (poderia ser tranquilamente o Mongodb dentro desse projeto)
- GraphQL

```
typeorm,opentelemetry,express-rate-limit,winston,git,axios,dotenv,docker,apollo, etc...
```

## 🚀 Como executar o projeto

Antes de começar, você vai precisar ter instalado em sua máquina alguns itens:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e [Docker](https://www.docker.com/products/docker-desktop/) . 
Além disto é bom ter um editor para navegar pelo código como [VSCode](https://code.visualstudio.com/) e [Postman](https://www.postman.com/downloads/) para as requisicões ( trabalhando com Graphql você pode usar outras como o playground entre outras, mas eu tenho o costume de usar postman 🤷 )

### Instalando o projeto

```bash
# Clone este repositório
$ git clone https://github.com/santosrennan/challenge-backend.git

# Instale as dependências
$ npm install 
```

### Rodando o projeto

Lembre-se de alterar o arquivo .env.example para .env 

```bash
# Rode o docker e suba o postgres
$ docker-compose up -d

# Execute a aplicação node
$ npm run start ou npm run start:dev

# Caso queria da uma populada basica no banco use seeds
$ npm run seed:run

```

## Test

```bash
# Rodando os testes unitarios
$ npm run test

# Rodando os testes e2e (teste com aplicacao de ar e com banco)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## ⚙️ Funcionalidades

Todos os requisitos foram atendidos e completamos o "CRUD". 

Vejamos algumas chamadas :
- Headers : `Authorization` = `admin-token` ou `student-token` ; `Userid` : `(Defina um qualquer) exemplo user1`

- Queries:
```bash
#consulta todos, regra valida para admin e student
query Contents {
    contents {
        id
        name
        description
        type
        views
    }
}

#consulta unico content regra valida para admin e student, porem apenas visualizacoes de student sao incrementadas sendo unicas por Userid
query Content {
    content(id: null) {
        id
        name
        description
        type
        views
    }
}
```
- Mutations:

```bash
//apenas admins
mutation CreateContent {
    createContent(name: null, description: null, type: null) {
        id
        name
        description
        type
        views
    }
}
//apenas admins
mutation UpdateContent {
    updateContent(id: null, name: null, description: null, type: null) {
        id
        name
        description
        type
        views
    }
}
//apenas admins
mutation DeleteContent {
    deleteContent(id: null)
}
```


## 💡 TO-DO - ROADMAP

Aqui vai alguns itens de melhoria que podem ser realizados visando uma maior escalabilidade do projeto que eu observei ao decorrer:

  - [ ] Uso de cache como do caching do Apollo ou banco Redis;
  - [ ] Uso de filas como BullMQ, RabbitMQ, SQS trabalhando com comunicação assíncrona;
  - [ ] Criação de um colletor para métricas e trace para Observabilidade/Monitoria usando bons padrões do opentelemetry nas apis, já foi feito um  `decorator TraceAndLog ` com log e otel no app, para passar por exemplo logstash e zipkin;
  - [ ] Criação de gerenciamento de usuário para comunicação , através de tokens dinâmicos como JWT 


## 💡 Observações

Aqui está meu depoimento sobre o projeto. Tentei focar nos requisitos solicitados e usar a stack da empresa. Tenho muita familiaridade com APIs Rest, porém me desafiei e usei GraphQL para sair da zona de conforto e aproveitar o desafio para praticar abordagens que não uso tanto no dia a dia. Foi bem legal essa parte, pensar de forma diferente.

Tive um problema quando coloquei o projeto Node no Docker para subir com o banco, porque meu notebook não tem muita memória e o Docker estava travando muito, deixando o desenvolvimento muito lento, assim optei por retirar o node e deixar apenas o banco no docker.
Não mockei completamente o teste E2E nem criei recursos em memória, pois realmente queria ver a performance de alguns pontos, como o rate limit e seu comportamento dentro dessa aplicação. Com recursos mockados, esse teste E2E do ratelimit perderia o sentido, pode se alterado o tamanho do rate no projeto, coloquei um volume pequeno para notebook não travar, então para rodar os teste levante o banco e o app.

Tentei deixar o projeto e o código de forma limpa e clara, e o TO-DO acima reflete o que pensei ao longo do tempo de desenvolvimento. Pensei em implementar um cache em alguma chamada apenas para incrementar o projeto, assim como criar um producer e consumer para usar o conceito de fila e eventos. Também pensei em criar o JWT para não precisar passar o token estático, mas me mantive nos requisitos para não fugir tanto do escopo do projeto e deixar de fazer o que realmente importava e foi solicitado. Nessa parte do token, incluí um UserId nos headers para imaginar o conceito de criação de usuário e controle de acesso, além de comportamentos únicos por ID de usuário. E também aproveitei bastante os recursos do Nestjs então muitas coisas ficaram mais "fáceis" , como por exemplo não precisar gerar o schema graphql, pois usei os decorators do NestJs para fazer essa parte.