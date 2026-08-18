# 📅 Cronograma do Front-End: Plano de Ação para os Dias 4, 5, 6 e 7 🚀

Este cronograma define a ordem cronológica exata de implementação do front-end em **Next.js (App Router)** utilizando o **Material UI (MUI)** com o tema personalizado. O objetivo é garantir que todos os fluxos críticos e opcionais exigidos pelo edital sejam entregues de forma robusta e com polimento profissional de nível sênior.

---

## 📅 Dia 4 — Setup, Layout Base, Autenticação e Tema
*O objetivo é assentar os trilhos do front-end, garantindo que o visual escuro moderno e o controle de acessos estejam 100% integrados.*

*   **Setup e Tema Customizado:**
    *   Configuração do `ThemeRegistry` do MUI integrado ao Next.js App Router.
    *   Implementação da paleta de cores Midnight (roxo vibrante, rosa coral, fundo ultra-escuro) e tipografia personalizada para fugir do visual genérico (*AI slop*).
*   **Camada de Conexão (Fetch API):**
    *   Criação do cliente `apiFetch` centralizado para gerenciar automaticamente as chamadas à API do Docker (porta `3000`) e injeção do token JWT.
*   **Fluxo de Autenticação (Telas de Acesso):**
    *   Desenvolvimento das telas de **Login** e **Cadastro de Usuário**.
    *   Implementação dos contextos de autenticação no Next.js (separando o acesso por funções: `CONSUMER`, `ORGANIZER` e `VALIDATOR`).

---

## 📅 Dia 5 — Catálogo de Cinema, Mapa de Assentos e Checkout Simulado
*O foco do quinto dia é a jornada principal de compra do cliente, do catálogo à confirmação de pagamento.*

*   **Catálogo de Filmes (Home):**
    *   Criação da página inicial listando os eventos ativos, exibindo cartazes puxados do TMDb, data, preço e capacidade.
    *   Componente de busca e filtro por categoria do evento.
*   **Mapa de Assentos Interativo (MUI):**
    *   Criação de um componente visual de seleção de poltronas (estilo cinema) para eventos com lugar marcado.
    *   Integração com a API para desabilitar assentos já ocupados e garantir a proteção de concorrência.
*   **Checkout e Simulação de Pagamento:**
    *   Interface de checkout exibindo o resumo do pedido (filme, assento selecionado, valor).
    *   Botões para simular explicitamente o status do pagamento: **Aprovar Compra** ou **Recusar Compra**.
    *   Tratamento de erro visual impecável para o cenário de recusa (exibição de erro sem quebrar o fluxo).

---

## 📅 Dia 6 — Ingressos com QR Code (HMAC), Portaria & Scanner de Câmera
*O sexto dia é focado na entrega de valor de segurança e portaria offline.*

*   **Painel "Meus Ingressos":**
    *   Listagem de todos os ingressos comprados pelo cliente.
    *   Geração visual do **QR Code** de segurança contendo o hash único gerado por HMAC-SHA256 do back-end.
    *   Rota pública de compartilhamento de voucher `/tickets/share/[hash]`.
*   **Devolução ao Estoque (Cancelamento):**
    *   Botão de "Cancelar Ingresso" com chamada ao novo endpoint de cancelamento atômico, devolvendo a poltrona ao estoque do evento.
*   **Scanner da Portaria (App Scanner):**
    *   Página exclusiva para usuários com o papel `VALIDATOR`.
    *   Integração com câmera usando biblioteca leve de leitura de QR Code.
    *   Campo de digitação manual do código como contingência.
    *   **Feedback Visual Gigante:** Telas coloridas inteiras indicando os 4 status exigidos pelo edital:
        *    **VALID** (Válido - Ingresso liberado)
        *    **ALREADY_USED** (Aviso - Ingresso já foi utilizado)
        *    **WRONG_EVENT** (Informativo - Evento incorreto para esta portaria)
        *    **INVALID** (Erro - Assinatura violada/Ingresso falso)

---

## 📅 Dia 7 — Painel do Organizador, Teste de Ponta a Ponta e Entrega
*O último dia é reservado para o gerenciamento de eventos, polimento estético final e consolidação do projeto.*

*   **Painel do Organizador:**
    *   Tela para criação de novos eventos com integração automática de busca do TMDb.
    *   Telas para **editar** dados do evento e **excluir** eventos sem vendas ativas.
*   **Refinamento de UI/UX:**
    *   Revisão minuciosa de carregamento (*skeletons* de carregamento do MUI) e tratamento de erros.
    *   Garantia de responsividade mobile impecável de todos os fluxos.
*   **Homologação Final (O "Show de Demonstração"):**
    *   Execução do fluxo completo de ponta a ponta no Docker.
    *   Escrita do README final detalhando a ausência de testes justificada e instrução ágil de partida via Docker Compose.
