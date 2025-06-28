# 📇 Agenda de Contatos - Desafio Starseg

Projeto Full Stack desenvolvido para o desafio técnico da Starseg. Trata-se de uma aplicação de agenda de contatos com suporte a imagem de perfil, busca automática de endereço via CEP, edição, exclusão e responsividade.

---

## 🚀 Tecnologias Utilizadas

### 🔧 Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Multer (upload de imagem)
- Zod (validação de dados)

### 🎨 Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### 🐳 Docker
- Docker + Docker Compose

---

## 💻 Funcionalidades

- ✅ Cadastro de contatos com validação de campos obrigatórios
- ✅ Upload de imagem de perfil com preview e salvamento
- ✅ Busca automática de endereço via API do ViaCEP
- ✅ Edição e exclusão de contatos
- ✅ Listagem de contatos com responsividade
- ✅ Backend e banco de dados dockerizados
- ✅ Comunicação entre serviços com Docker Compose

---

## 📦 Como rodar o projeto com Docker

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/agenda-contatos-starseg
cd agenda-contatos-starseg

# 2. Rode o projeto
docker-compose up --build