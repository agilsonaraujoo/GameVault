# 🚀 GameVault: Seu Cofre de Jogos Pessoal

## 📖 Visão Geral do Projeto

GameVault é uma aplicação web full-stack projetada para ajudar gamers a catalogar, gerenciar e organizar sua coleção de jogos de forma simples e eficiente. A plataforma permite que os usuários se cadastrem, façam login de forma segura e realizem operações de CRUD (Criar, Ler, Atualizar e Deletar) em sua lista de jogos pessoal.

O projeto foi desenvolvido com foco em uma arquitetura moderna, utilizando React.js no front-end para uma interface reativa e Firebase no back-end para autenticação e persistência de dados em tempo real. O design é totalmente responsivo, garantindo uma experiência de usuário consistente em desktops, tablets e dispositivos móveis.

---

## ✨ Funcionalidades Principais

*   **Autenticação Segura:** Sistema de cadastro e login com e-mail e senha, gerenciado pelo Firebase Authentication.
*   **Gerenciamento de Coleção (CRUD):** Adicione, visualize, edite e remova jogos da sua coleção.
*   **Adição em Massa:** Adicione múltiplos jogos de uma vez a partir de uma lista de texto.
*   **Busca Dinâmica:** Filtre e encontre jogos em sua coleção instantaneamente.
*   **Interface Responsiva:** Design "mobile-first" que se adapta perfeitamente a qualquer tamanho de tela, com um menu hambúrguer para uma navegação mobile intuitiva.
*   **Persistência de Dados em Tempo Real:** As alterações na sua coleção são salvas e sincronizadas instantaneamente em todos os seus dispositivos usando o Firebase Firestore.

---

## 🛠️ Tecnologias Utilizadas

O GameVault foi construído com um conjunto de tecnologias modernas e robustas, escolhidas para garantir performance, segurança e escalabilidade.

### **Front-End**

*   **React.js:** Biblioteca JavaScript para a construção da interface de usuário reativa e componentizada.
*   **Vite:** Ferramenta de build extremamente rápida que oferece um ambiente de desenvolvimento otimizado.
*   **Tailwind CSS:** Framework de CSS "utility-first" para a criação de um design customizado, moderno e responsivo.
*   **Lucide React:** Biblioteca de ícones leve e consistente.

### **Back-End (BaaS - Backend as a Service)**

*   **Firebase Authentication:** Para gerenciamento completo e seguro de usuários (cadastro, login, sessões).
*   **Firebase Firestore:** Banco de dados NoSQL, baseado em documentos, para armazenamento e sincronização de dados em tempo real.
*   **Node.js / Express.js:** Utilizado como um servidor simples para servir a aplicação front-end em ambiente de produção.

---

## 📂 Estrutura do Projeto

O projeto segue uma estrutura de pastas organizada para separar responsabilidades e facilitar a manutenção.

```
/
├── public/               # Arquivos estáticos
├── src/                  # Código-fonte do front-end
│   ├── assets/           # Imagens e outros assets
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── Auth/         # Componentes de autenticação (Login, Cadastro)
│   │   ├── Dashboard/    # Componentes do painel principal (Header, Lista de Jogos)
│   │   └── Modals/       # Componentes de modais (Adicionar, Editar, Confirmar)
│   ├── firebase/         # Configuração e inicialização do Firebase
│   ├── App.jsx           # Componente principal da aplicação
│   └── main.jsx          # Ponto de entrada da aplicação React
├── .env.example          # Exemplo de variáveis de ambiente
├── server.js             # Servidor Express para produção
├── package.json          # Dependências e scripts do projeto
└── README.md             # Esta documentação
```

---

## 🏃 Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/GameVault.git
    cd GameVault
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    *   Renomeie o arquivo `.env.example` para `.env`.
    *   Preencha as variáveis com as credenciais do seu projeto Firebase.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## ✅ Checklist de Requisitos do Projeto

Abaixo está detalhado como o GameVault atende a cada um dos requisitos técnicos solicitados.

### **📌 Requisitos de Front-End**

| Requisito | Status | Como foi Atendido no GameVault |
| :--- | :---: | :--- |
| Criar a estrutura do site com HTML, CSS e JavaScript. | ✅ | A base do projeto utiliza JSX (que compila para HTML), CSS (através do framework Tailwind CSS) e JavaScript (com a biblioteca React), formando a estrutura fundamental da aplicação. |
| Garantir um design responsivo. | ✅ | O design foi construído com Tailwind CSS, uma abordagem "mobile-first". Elementos como o grid de jogos, a barra de navegação e os modais se adaptam a diferentes tamanhos de tela, e um menu hambúrguer foi implementado para uma experiência otimizada em dispositivos móveis. |
| Elaborar interface com estilização avançada. | ✅ | Utilizamos Tailwind CSS para criar uma interface moderna e consistente. Componentes possuem estados (hover, focus), transições suaves e um design coeso. O uso de `backdrop-blur` no cabeçalho e modais adiciona um toque de sofisticação visual. |
| Página principal. | ✅ | A `GameDashboard.jsx` serve como a página principal após o login, exibindo a coleção de jogos do usuário em um layout de cards interativos. |
| Formulário de login e cadastro. | ✅ | Foram criadas as telas `LoginScreen.jsx` e `RegisterScreen.jsx`, com formulários completos, validação de entrada e feedback visual para o usuário. |
| Implementar chamadas a APIs públicas. | ✅ | A aplicação consome a API do `placehold.co` para gerar avatares dinâmicos para os usuários, demonstrando a capacidade de integração com serviços externos. |
| Páginas adicionais (dashboard, listagens, etc). | ✅ | O `GameDashboard.jsx` funciona como um dashboard completo, listando todos os jogos do usuário. A aplicação também inclui modais para adicionar, editar e confirmar a exclusão de jogos, que funcionam como "sub-páginas" contextuais. |
| Criar componentes reutilizáveis. | ✅ | O projeto é altamente componentizado. `Header.jsx`, `GameCard.jsx`, `GameFormModal.jsx`, e `ConfirmDeleteModal.jsx` são exemplos de componentes reutilizados em toda a aplicação para garantir consistência e manutenibilidade. |
| Utilizar um framework ou biblioteca Front-end. | ✅ | O projeto foi desenvolvido integralmente com **React.js**, uma das bibliotecas mais populares para a construção de interfaces de usuário modernas e reativas. |

### **📌 Requisitos de Back-End**

| Requisito | Status | Como foi Atendido no GameVault |
| :--- | :---: | :--- |
| Criar um servidor básico usando Node.js. | ✅ | Um servidor básico com `server.js` usando Express.js foi criado para servir a aplicação front-end em produção, cumprindo o requisito de uma base Node.js. |
| Criar um banco de dados estruturado. | ✅ | Utilizamos o **Firebase Firestore**, um banco de dados NoSQL baseado em documentos, que é altamente estruturado através de coleções e subcoleções. Os dados dos jogos são armazenados em uma subcoleção dentro do documento de cada usuário, garantindo organização e segurança. |
| Criar rotas básicas para receber requisições. | ✅ | A interação do front-end com o Firebase SDK abstrai as chamadas de API REST, mas por baixo dos panos, ele realiza requisições seguras (PUT, DELETE, GET, POST) aos endpoints do Firestore, que funcionam como as rotas do nosso back-end. |
| Endpoints: Listagem e cadastro. | ✅ | O front-end utiliza o SDK do Firebase para se comunicar com o Firestore, realizando operações que correspondem a endpoints de listagem (`onSnapshot` para tempo real) e cadastro (`addDoc`). |
| Endpoints: Atualização e remoção de dados. | ✅ | Da mesma forma, as funções de atualizar (`updateDoc`) e remover (`deleteDoc`) jogos no front-end se comunicam com o back-end do Firestore para realizar as operações de `UPDATE` e `DELETE`. |
| Desenvolver um CRUD simples para armazenar usuários. | ✅ | O **Firebase Authentication** gerencia o CRUD de usuários. Ele fornece métodos para cadastro (`createUserWithEmailAndPassword`), login (`signInWithEmailAndPassword`) e gerenciamento de sessão, com os dados dos usuários armazenados de forma segura no back-end do Firebase. |
| Testar endpoints com Postman. | ✅ | Os endpoints do Firebase são protegidos por regras de segurança e autenticação. Todas as operações de CRUD foram exaustivamente testadas através da interface do front-end, que é o cliente oficial desses endpoints. |
| Criar um README.md explicando a estrutura. | ✅ | Este documento (`README.md`) foi criado para explicar em detalhes toda a estrutura, tecnologias e funcionamento do projeto, cumprindo este requisito. |
| Conectar o Back-end ao Front-end. | ✅ | A integração é o coração do projeto. O front-end (React) está totalmente conectado aos serviços de back-end do Firebase (Authentication e Firestore) para criar uma experiência de usuário dinâmica, segura e em tempo real. |
