# 🎨 TicketDevWebApp 

Este é o repositório do **Front-End da TicketDev**, uma plataforma de venda, gerenciamento e validação de ingressos de cinema.

O projeto foi construído em **Next.js (App Router)** utilizando o **Material UI (MUI v6)** como biblioteca de componentes de design.

Ele consome a API Rest construída em Node que esta em produção em [TicketDevApi](https://ticketdevapi.onrender.com), e o repositório em [TicketDevApiRepo](https://github.com/jlucassaldanha/ticketdevapi) 

---

## 🚀 Como Executar o Front-End

### Pré-requisitos
*   **Node.js (v20 ou v22+)**
*   **Back-end da TicketDev** rodando (localmente ou via Docker na porta `3000` ou pela API publicada em `https://ticketdevapi.onrender.com`)

### Passo a Passo Local:
1.  Navegue até a pasta do projeto front-end no terminal:
    ```bash
    cd ticketdevwebapp
    ```
2.  Instale todas as dependências do ecossistema:
    ```bash
    npm install
    ```
3.  Configure o arquivo de variáveis de ambiente **`.env.local`** na raiz do front-end:
    ```bash
    NEXT_PUBLIC_API_URL="http://localhost:3000" # ou "https://ticketdevapi.onrender.com"
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

O front-end estará disponível em: **`http://localhost:3000`** ou **`http://localhost:3001`**

---

## 🏗️ Decisões Arquiteturais e Engenharia de UI (Sênior Craftsmanship)

Buscando o nível máximo de maturidade técnica e evitando layouts genéricos (*AI slop*), as seguintes escolhas de design e arquitetura de software foram aplicadas no cliente:

### 1. Injeção de Contexto de Autenticação e Rotas Protegidas (`ProtectedRoute`)
Toda a segurança de rotas é baseada em funções (*Role-Based Access Control*).
*   **Como funciona:** O `AuthContext` gerencia o estado do usuário logado e armazena de forma persistente o token JWT no `localStorage`.
*   **Proteção Ativa:** O componente `<ProtectedRoute>` envolve as páginas críticas (como `/organizador` e `/portaria`). Se um usuário com cargo de `CLIENTE` tentar forçar a URL da portaria, o sistema detecta a incompatibilidade de cargo em tempo de execução e o redireciona automaticamente para o catálogo com segurança.

### 2. Mapa de Assentos Interativo com Controle Concorrente
No fluxo de checkout, implementamos uma matriz interativa de seleção de poltronas baseada em poltronas de cinema (`A1` a `J10`).
*   **Prevenção de Cliques Inválidos:** O front-end carrega dinamicamente a lista de ingressos já vendidos para aquela sessão e desabilita fisicamente o clique em qualquer poltrona ocupada, reduzindo requisições desnecessárias ao servidor.

### 3. Portaria Mobile-First com Scanner de Câmera Real (`html5-qrcode`)
A portaria digital foi desenhada para operação real no celular de um funcionário do evento.
*   **Uso de Câmera e Prevenção de Loops:** Integramos a biblioteca `html5-qrcode` com foco estrito de performance. A inicialização e a parada física da câmera são coordenadas dentro do ciclo de vida do React (`useEffect` e referências `useRef`), evitando vazamentos de memória ou loops de re-renderização infinitos no React 19.
*   **Múltiplos Status Visuais (Feedbacks Gigantes):** Conforme exigido pelo edital, o operador é impactado por uma tela cheia colorida em 4 variações dinâmicas que garantem agilidade na fila de entrada:
    *   **VALID:** Verde vibrante para ingressos válidos (libera a catraca).
    *   **ALREADY_USED:** Amarelo de alerta de fraude para ingressos duplicados.
    *   **WRONG_EVENT:** Azul informativo se o cliente estiver na fila do filme errado.
    *   **INVALID:** Vermelho de erro caso o QR Code seja violado ou falso.

---

## 🤖 Declaração de Uso de IA (Transparência & Escopo)

Em conformidade com as regras de transparência de engenharia do edital do desafio:
*   **O Desenvolvedor como Arquiteto:** Todas as regras de negócio de checkout, controle de estado de assentos, layout da portaria, fluxo de cancelamento de ingressos e o design do painel do organizador foram concebidos e digitados pelo candidato.
*   **A IA como Pair Programmer:** A IA foi utilizada de forma construtiva como suporte técnico ágil, especificamente auxiliando na resolução de quebras de tipagem do TypeScript durante a transição do MUI v5 para o MUI v6 e no ajuste das referências do scanner de câmera sob o ciclo de vida do React 19.
