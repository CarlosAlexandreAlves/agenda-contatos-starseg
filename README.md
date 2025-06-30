# ✨ Agenda de Contatos - Star Seg

Aplicativo FullStack desenvolvido como parte do desafio prático para a vaga de Desenvolvedor na Star Seg. Esta aplicação permite gerenciar uma agenda de contatos com recursos de cadastro, edição, exclusão e upload de foto de perfil.

## 🔍 Visão Geral

* Cadastro de contatos com dados completos (nome, telefone, e-mail, endereço completo)
* Validação de todos os campos obrigatórios
* Integração com a API ViaCEP para preenchimento automático do endereço via CEP
* Upload de imagem de perfil (com preview)
* Responsividade total para desktop, tablet e dispositivos móveis
* Edição e exclusão de contatos com confirmação e feedback visual
* Imagens antigas são automaticamente excluídas no backend ao substituir ou remover contatos

## 📚 Tecnologias Utilizadas

### Frontend

* [Next.js](https://nextjs.org/) + TypeScript
* Tailwind CSS + Responsividade com Grid
* react-toastify (notificações)
* API ViaCEP

### Backend

* Node.js + TypeScript
* Express.js
* Prisma ORM
* PostgreSQL
* Multer (upload de imagens)

### Outros

* Docker + Docker Compose
* ESLint + Prettier (padronização de código)

## 🚀 Como Executar Localmente

1. Clone o repositório

```bash
git clone https://github.com/CarlosAlexandreAlves/agenda-contatos-starseg.git
cd agenda-contatos-starseg
```

2. Crie o arquivo .env na pasta backend/ com o conteúdo:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda"

*Lembre-se de substituir os campos!*

3. Configure o banco PostgreSQL

Crie um banco chamado `agenda` e defina a variável de ambiente no `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda"
```

4. Instale as dependências

```bash
cd backend
npm install
npx prisma migrate dev --name init

cd ../frontend
npm install
```

5. Rode o projeto

Em dois terminais:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Acesse em: [http://localhost:3000]

---

## 🛠️ Como rodar com Docker

1. Configure variáveis no `.env` (backend):

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda"
```

2. *Na raiz do projeto* Rode via Docker Compose:

```bash
docker-compose up --build
```

Frontend: [http://localhost:3000]
Backend: [http://localhost:4000]
Swagger (documentação da API): [http://localhost:4000/docs]

---

## 📄 Funcionalidades

* [x] Cadastro de novos contatos
* [x] Validação dos campos obrigatórios
* [x] Integração com ViaCEP (CEP -> endereço)
* [x] Listagem responsiva
* [x] Edição de contatos existentes
* [x] Exclusão com confirmação
* [x] Upload de imagem de perfil

## ✨ Diferenciais Implementados

* [x] Responsividade (mobile/tablet/desktop)
* [x] Upload de imagem de perfil
* [x] Dockerização completa (frontend + backend + PostgreSQL)
* [x] Clean Code: estrutura modular e organizada

## 📢 Contato

Se você chegou até aqui, muito obrigado! Para dúvidas ou sugestões:

Carlos Alves - [carlossalves101@gmail.com]

---

> Desenvolvido para o desafio Star Seg.