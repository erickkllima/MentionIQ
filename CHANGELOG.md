# 📑 Changelog - MentionIQ

Este arquivo documenta a linha do tempo de desenvolvimento do projeto **MentionIQ**, com base nas sprints e checkpoints registrados durante o desenvolvimento.

---

## [0.1.0] - 2025-08-17
### Added
- Estrutura inicial do projeto com **frontend (React + Vite)** e **backend (Node.js + Express + SQLite)**.
- Configuração de autenticação básica (registro, login, logout) com `passport`.
- Rotas iniciais para **menções, tags, relatórios e consultas**.
- Implementação de **seed** automático no banco SQLite.
- Setup de **scraper simulado** para menções de teste.
- Integração de frontend com backend.
- Deploy local bem-sucedido: backend rodando em `localhost:5000` e frontend em `localhost:5173`.

### Fixed
- Correção de erros de import/export (`storage`, `scraper`, `registerRoutes`).
- Ajustes no `schema.ts` para compatibilidade com SQLite.
- Ajustes no `storage.ts` para tratamento correto de `tags` como JSON.
- Correção de problemas no fluxo de seed inicial.

### Notes
- Checkpoint inicial de controle de versão criado com **CHANGELOG.md**.
- O sistema já roda localmente com frontend + backend integrados, pronto para próximas sprints.

---

## Estrutura futura do CHANGELOG
Sempre que avançarmos em uma sprint ou resolvermos um bug importante, o changelog será atualizado no seguinte formato:

- `### Added` → Funcionalidades novas
- `### Changed` → Alterações em funcionalidades já existentes
- `### Fixed` → Correções de bugs
- `### Removed` → Funcionalidades ou dependências removidas

---

📅 **Última atualização:** 2025-08-17 23:20
