# 📊 MentionIQ

Monitoramento inteligente de menções em redes sociais, sites e blogs, com análise de sentimento integrada via **OpenAI GPT**.

## 🚀 Funcionalidades

- 🔎 **Busca de menções** em redes sociais simuladas e em sites/blogs
- 😀 **Análise de sentimento** (positivo, neutro, negativo)
- 🏷️ **Sugestão automática de tags**
- 📈 **Dashboard interativo** com métricas e tendências
- 🔐 **Autenticação de usuários** (login, registro e sessão)
- 💾 **Persistência de dados** com SQLite + Drizzle ORM
- ⚡ **Frontend moderno** com React + Tailwind + shadcn/ui

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Vite, TailwindCSS, shadcn/ui, TanStack Query
- **Backend**: Node.js, Express, Passport.js
- **Banco de Dados**: SQLite + Drizzle ORM
- **IA/Serviços**: OpenAI API (para análise de sentimentos e tags)
- **Outros**: TypeScript, ESLint, Prettier

---

## 📂 Estrutura do Projeto
mentioniq/
├── client/ # Código do frontend (React + Vite)
├── server/ # Código do backend (Express + Drizzle)
├── shared/ # Schemas compartilhados (Drizzle ORM + Types)
├── drizzle.config.ts # Configuração do Drizzle ORM
├── package.json
└── README.md
---

## ⚙️ Como rodar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/mentioniq.git
cd mentioniq
2️⃣ Instalar dependências
npm install

3️⃣ Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto e adicione:

SESSION_SECRET=sua_chave_super_secreta
OPENAI_API_KEY=sua_chave_openai

4️⃣ Rodar o backend
npm run dev


Servidor rodando em http://localhost:5000

5️⃣ Rodar o frontend

Em outra aba/terminal:

cd client
npm run dev


Frontend rodando em http://localhost:5173

📸 Screenshots
Dashboard

Busca de Menções

🤝 Contribuição

Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b minha-feature)

Commit suas alterações (git commit -m 'Adiciona nova feature')

Push para sua branch (git push origin minha-feature)

Abra um Pull Request 🚀

📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE
 para mais detalhes.
 
---

👉 Repare que deixei referências a **screenshots** (`docs/dashboard.png` e `docs/search.png`).  
Você pode criar uma pasta `docs/` na raiz e salvar capturas do sistema lá para aparecer no README.

---

Quer que eu já prepare também o **.gitignore** e um **LICENSE (MIT)** para deixar o repositório redondo?
