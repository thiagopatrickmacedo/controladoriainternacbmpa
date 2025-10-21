# 🛡️ Controladoria Interna CBMPA

<div align="center">
  <img src="public/favicon.svg" alt="Logo Controladoria Interna CBMPA" width="120" />
  
  ### Sistema de Gestão de Conteúdo para Transparência Pública
  
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
  **[🌐 Ver Site ao Vivo](https://controladoria-interna-cbmpa.web.app/)**
</div>

---

## 📋 Sobre o Projeto

O **Portal da Controladoria Interna do CBMPA** é uma plataforma web moderna desenvolvida para promover a transparência e o controle efetivo dos recursos públicos do Corpo de Bombeiros Militar do Pará. 

O sistema oferece uma interface intuitiva para a gestão e publicação de conteúdo educacional em formato de vídeo, focado em temas como transparência pública, monitoramento de contratos e capacitação de servidores.

### 🎯 Objetivos

- 📚 Centralizar conteúdo educacional sobre transparência e controle interno
- 🎥 Facilitar o acesso a vídeos educativos categorizados
- 🔐 Permitir gestão administrativa segura do conteúdo
- 👥 Oferecer controle de acesso baseado em papéis (Admin, Publicador, Usuário)
- 📱 Proporcionar experiência responsiva em todos os dispositivos

---

## 🎨 Design

O projeto foi inicialmente concebido e prototipado utilizando:

- **[Figma](https://www.figma.com/)** - Design de interface e prototipação
- **[Make (Figma)](https://www.figma.com/community)** - Conversão do design para código inicial

O design segue as diretrizes visuais institucionais do CBMPA, com paleta de cores oficial:
- 🔵 Azul Institucional: `#0A1F44`
- 🟡 Dourado: `#C9A227`
- ⚪ Cinza Claro: `#F2F2F2`

---

## ✨ Funcionalidades

### 👤 Para Visitantes
- ✅ Visualização de vídeos educativos organizados por categoria
- ✅ Sistema de busca por título e descrição
- ✅ Carrossel de vídeos em destaque
- ✅ Interface responsiva e acessível
- ✅ Visualização de informações de contato e links úteis

### 🔐 Para Administradores
- ✅ Autenticação via Google
- ✅ Painel completo de gerenciamento de vídeos (CRUD)
- ✅ Gerenciamento de categorias personalizadas
- ✅ Controle de vídeos em destaque
- ✅ Gestão de usuários e permissões
- ✅ Gerenciamento dinâmico do rodapé (links e contatos)

### 📝 Para Publicadores
- ✅ Permissão para adicionar e editar vídeos
- ✅ Gerenciamento de categorias
- ✅ Controle de destaques

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **[React 19](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool e dev server ultrarrápido
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones

### Backend & Infraestrutura
- **[Firebase](https://firebase.google.com/)**
  - 🔥 **Authentication** - Autenticação via Google
  - 🗄️ **Firestore** - Banco de dados NoSQL em tempo real
  - 🌐 **Hosting** - Hospedagem estática com CDN global
  - 🔒 **Security Rules** - Regras de segurança granulares

### Ferramentas de Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter para qualidade de código
- **[PostCSS](https://postcss.org/)** - Processador de CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Adiciona prefixos vendor automaticamente

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase (para deploy)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/controladoriainternacbmpa.git
cd controladoriainternacbmpa
```

### 2️⃣ Instale as dependências

```bash
---

<!-- Bloco institucional e trecho de configuração removidos por solicitação do mantenedor -->

---

## 🏗️ Build e Deploy

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Deploy no Firebase Hosting

```bash
# Login no Firebase CLI
firebase login

# Deploy
firebase deploy
```

---

## 📁 Estrutura do Projeto

```
controladoriainternacbmpa/
├── public/                    # Arquivos estáticos públicos
│   └── favicon.svg           # Ícone do site
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes de UI reutilizáveis
│   │   ├── icons/           # Ícones customizados
│   │   ├── AdminDashboard.tsx
│   │   ├── CategoryManager.tsx
│   │   ├── FeaturedSlider.tsx
│   │   ├── Footer.tsx
│   │   ├── FooterManager.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LoginModal.tsx
│   │   ├── UserManager.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoGallery.tsx
│   │   └── VideoPlayer.tsx
│   ├── lib/                  # Configurações e utilitários
│   │   └── firebase.ts      # Configuração do Firebase
│   ├── services/             # Serviços e APIs
│   │   ├── adminService.ts
│   │   └── userService.ts
│   ├── types/                # Definições TypeScript
│   │   ├── content.ts
│   │   └── user.ts
│   ├── utils/                # Funções utilitárias
│   │   └── videoHelpers.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── firestore.rules          # Regras de segurança Firestore
├── firebase.json            # Configuração Firebase
├── .firebaserc              # Projeto Firebase ativo
├── tailwind.config.ts       # Configuração Tailwind CSS
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
└── package.json             # Dependências do projeto
```

---

## 🗄️ Estrutura do Banco de Dados (Firestore)

### Coleções

#### `videos`
```typescript
{
  id: string
  title: string
  description: string
  category: string
  duration: string
  thumbnail: string
  videoUrl: string
  publishDate: string
  featured: boolean
  createdAt: timestamp
}
```

#### `categories`
```typescript
{
  id: string
  name: string
  label: string
  color: string
}
```

#### `users`
```typescript
{
  uid: string
  displayName: string
  email: string
  role: 'admin' | 'publisher' | 'user'
  provider: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `footerConfig`
```typescript
{
  id: 'default'
  description: string
  links: Array<{
    id: string
    label: string
    url: string
    order: number
  }>
  contacts: Array<{
    id: string
    type: 'email' | 'phone' | 'whatsapp' | 'location' | 'website'
    label: string
    value: string
    order: number
  }>
}
```

---

## 🔒 Regras de Segurança

O projeto implementa regras de segurança granulares no Firestore:

- 📖 **Leitura pública** para vídeos, categorias e footer
- ✍️ **Escrita autenticada** para vídeos e categorias
- 👤 **Usuários** podem ler/editar apenas seus próprios dados
- 👑 **Administradores** têm acesso total a usuários e footer
- 🔐 **Coleção `admins`** apenas leitura (configurada manualmente)

---

## 👥 Sistema de Permissões

### Papéis de Usuário

| Papel | Permissões |
|-------|-----------|
| **Usuário** | Visualizar conteúdo público |
| **Publicador** | Gerenciar vídeos e categorias |
| **Administrador** | Acesso total + gerenciar usuários e footer |

### Administrador Principal

O administrador principal é definido por email no código:
```typescript
// src/services/userService.ts
export const GOOGLE_ADMIN_EMAIL = "cpci193.app@gmail.com";
```

---

## 🎥 Integração com YouTube

O sistema suporta URLs do YouTube em diversos formatos:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

As thumbnails são automaticamente geradas a partir do ID do vídeo.

---

## 🌐 Deploy e Hospedagem

O site está hospedado no Firebase Hosting com:
- ✅ SSL/HTTPS automático
- ✅ CDN global
- ✅ Deploy automático via CLI
- ✅ Rollback fácil de versões

**URL de Produção:** [https://controladoria-interna-cbmpa.web.app/](https://controladoria-interna-cbmpa.web.app/)

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview da build localmente

# Qualidade de Código
npm run lint         # Executa ESLint
```

---

## 📝 Licença

Este projeto é propriedade da **Controladoria Interna do CBMPA**.

---

## 📞 Contato

**Controladoria Interna - CBMPA**

Para mais informações, visite: [https://controladoria-interna-cbmpa.web.app/](https://controladoria-interna-cbmpa.web.app/)

---

<div align="center">
  
  **Feito com ❤️ pela Controladoria Interna do CBMPA**
  
  ⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
