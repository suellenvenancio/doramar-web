# Doramar Web

Este é o frontend da aplicação Doramar, construído com as tecnologias mais modernas do ecossistema React. Utilizamos Next.js para garantir performance, juntamente com o Tailwind CSS para uma estilização rápida e responsiva. O projeto também possui autenticação integrada via Firebase e utiliza bibliotecas robustas para gerenciamento de estado, arrastar e soltar (drag & drop), validação de formulários e testes.

## 🚀 Tecnologias e Ferramentas

As principais bibliotecas e ferramentas utilizadas no projeto são:

- **Framework Core**: [Next.js](https://nextjs.org/) (Versão 16+) / [React](https://react.dev/) (Versão 19+)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Autenticação**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Manipulação de Dados (Fetch)**: [Axios](https://github.com/axios/axios) e [SWR](https://swr.vercel.app/)
- **Formulários e Validação**: [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/)
- **Interação (Drag and Drop)**: [@dnd-kit](https://dndkit.com/)
- **Testes**: [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/)
- **Padronização de Código**: ESLint, Prettier e TypeScript

## 📦 Estrutura do Projeto

O projeto utiliza a estrutura do App Router do Next.js (`src/app`). As pastas principais incluem:

- `/src/app`: Onde residem as rotas (ex: `/(public)/login`, `/(public)/create-account`)
- `/src/components`: Componentes reutilizáveis de interface
- `/src/context`: Gerenciadores de estado globais e contexto provedores (ex: `AuthProvider`)
- `/src/assets`: Imagens e arquivos estáticos
- `/tests`: Configurações e arquivos para os testes unitários e de integração com Jest

## 🛠️ Como Executar Localmente

### Pré-requisitos

- Node.js (Versão recomendada: 20+)
- Gerenciador de pacotes NPM (ou Yarn/Pnpm/Bun de acordo com a sua preferência)

### Passo a Passo

1. Após clonar ou baixar os arquivos deste repositório, instale as dependências:

   ```bash
   npm install
   ```

2. Crie ou configure um arquivo `.env` na raiz do projeto com base nas chaves do Firebase e em outras variáveis de ambiente necessárias para a API e Autenticação.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse em seu navegador a porta padrão informada pelo Next.js.

## 🧪 Como Executar os Testes

O projeto utiliza Jest como seu ambiente de testes padrão. Você pode rodá-los com o seguinte comando:

```bash
# Rodar todos os testes de uma vez
npm run test

# Rodar os testes em modo escuta (watch)
npm run test:watch
```

## ✨ Funcionalidades Principais

- **Sistema de Contas**: Login e criação de contas via Firebase Auth.
- **Componentes Drag & Drop**: Uso do dnd-kit na interface.
- **Proteção de Rotas**: Controle de fluxo de acesso nas pastas (públicas e privadas).
- **Feedback ao Usuário**: Notificações Toast interativas (react-toastify).

