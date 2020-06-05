<p align="center">
  <a href="" rel="noopener">
 <img src="https://user-images.githubusercontent.com/35263018/83899733-ef15ca80-a726-11ea-91dd-428eab65e063.png" alt="Ecoleta"></a>
</p>

<h3 align="center">Ecoleta</h3>

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/lebarreto/ecoleta)
![GitHub issues](https://img.shields.io/github/issues/lebarreto/ecoleta)
![GitHub pull requests](https://img.shields.io/github/issues-pr/lebarreto/ecoleta)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Marketplace de coleta de resíduos ♻️
    <br> 
</p>

## 📝 Table of Contents

- [Sobre](#about)
- [Como configurar o projeto](#getting_started)
- [Tecnologias](#built_using)
- [Licença](#license)
- [Autores](#authors)

## 🧐 Sobre <a name = "about"></a>

O Ecoleta é um marketplace de coleta de resíduos, com o objetivo de fazer a conexão entre empresas ou entidades que coletam resíduos (orgânicos ou inorgânicos) às pessoas que precisam descartar esses resíduos.

<img width="1023" alt="Ecoleta" src="https://user-images.githubusercontent.com/35263018/83901229-6bf57400-a728-11ea-9c55-7840c9205236.png">

## 🏁 Como configurar o projeto <a name = "getting_started"></a>

Essas instruções servem para que você consiga ter uma cópia do projeto e rodar o mesmo em sua máquina local.

### Instalação do backend

Para rodar o backend em sua máquina, siga o seguinte passo a passo:

1. Faça o clone desse repositório.
2. Entre na pasta do backend: `cd server`.
3. Rode `yarn` para instalar todas as dependências.
4. Rode `yarn knex:migrate` para executar todas as migrations.
5. Rode `yarn knex:seed` para executar todas as seeds.
6. Insira o IP da sua máquina nos arquivos <strong>ItemsController e PointsController</strong>, entrando na pasta <strong>src/controllers</strong>
6. Rode `yarn dev:server` para iniciar a api.

### Instalação do frontend

Para rodar o frontend em sua máquina, siga o seguinte passo a passo:

1. Inicialize o backend.
2. Entre na pasta do frontend: `cd frontend`.
3. Rode `yarn` para instalar todas as dependências.
4. Rode `yarn start` para iniciar o frontend.

### Instalação do mobile

Para rodar o projeto mobile em sua máquina, siga o seguinte passo a passo:

1. Inicialize o backend.
2. Entre na pasta do mobile: `cd mobile`.
3. Rode `yarn` para instalar todas as dependências.
4. Rode `yarn start` para iniciar o projeto mobile.
5. Instale no seu dispositivo mobile o aplicativo da Expo.
6. Escaneie o QR code e abra o projeto no aplicativo da Expo.

## ⛏️ Tecnologias <a name = "built_using"></a>

- [Sqlite](https://www.sqlite.org/index.html)
- [Express](https://expressjs.com/)
- [ReactJS](https://reactjs.org/)
- [NodeJs](https://nodejs.org/en/)
- [React Native](https://reactnative.dev/)
- [Typescript](https://www.typescriptlang.org/)

## :memo: Licença <a name = "license"></a>

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✍️ Autores <a name = "authors"></a>

- [@lebarreto](https://github.com/lebarreto)
- [@rocketseat](https://github.com/Rocketseat)

Projeto desenvolvido na semana Next Level Week (Booster) da Rocketseat :wave:
