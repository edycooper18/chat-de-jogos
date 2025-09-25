document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const conversationDisplay = document.getElementById('conversation-display');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const choicesArea = document.getElementById('choices-area');
    const restartButton = document.getElementById('restart-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // Hide restart button initially and choices area
    restartButton.classList.add('hidden');
    choicesArea.style.display = 'none';
    let hasInteracted = false;

    // --- Conversation Flow Data ---
    // Define the conversation nodes. Each node has a message (response for text input).
    const conversationNodes = {
        'start': {
            message: 'Olá! Bem-vindo(a) ao Chat de Jogos. Como posso ajudar hoje? Diga algo como "gêneros", "consoles" ou "suporte".'
        },
        'genres': {
            message: 'Adoramos jogos! Quais gêneros te interessam? Por exemplo, diga "FPS", "RPG" ou "aventura".'
        },
        'fps_info': {
            message: 'FPS (First-Person Shooter) são jogos de tiro em primeira pessoa, como Call of Duty ou Counter-Strike. Gosta de ação rápida? Diga "sim" para recomendações.'
        },
        'rpg_info': {
            message: 'RPG (Role-Playing Game) envolvem histórias profundas e personagens, como The Witcher ou Final Fantasy. Prefere narrativas? Diga "sim" para mais.'
        },
        'adventure_info': {
            message: 'Jogos de aventura focam em exploração e puzzles, como The Legend of Zelda. Qual estilo de aventura? Diga "ação" ou "puzzle".'
        },
        'consoles': {
            message: 'Temos suporte para vários consoles. Qual o seu? Diga "PC", "PlayStation" ou "Xbox".'
        },
        'pc_gaming': {
            message: 'PC gaming oferece customização infinita! Precisa de dicas de hardware ou jogos? Diga "hardware" ou "jogos".'
        },
        'playstation': {
            message: 'PlayStation tem exclusivos incríveis como God of War. Qual PS você tem? Diga "PS4" ou "PS5".'
        },
        'xbox': {
            message: 'Xbox é ótimo para multiplayer com Game Pass. Interessado em serviços? Diga "sim" para detalhes.'
        },
        'support': {
            message: 'Problemas com jogos? Descreva: diga "lag", "crash" ou "controle".'
        },
        'lag_support': {
            message: 'Lag pode ser rede ou hardware. Tente fechar apps em background ou verificar conexão. Ainda persiste? Diga "sim" para mais dicas.'
        },
        'crash_support': {
            message: 'Crashes geralmente são drivers ou atualizações. Atualize drivers da GPU e verifique integridade dos arquivos do jogo. Diga "ajuda" para passos.'
        },
        'controller_support': {
            message: 'Problemas com controle? Verifique conexões Bluetooth ou USB. Para consoles, reset o controle. Diga "reset" para guia.'
        },
        'recommendations': {
            message: 'Recomendações personalizadas: Para FPS, experimente Valorant; para RPG, Elden Ring. Gosta de multiplayer? Diga "sim".'
        },
        'end_conversation': {
            message: 'Foi ótimo falar de jogos! Volte sempre. Diga "reiniciar" para começar de novo.'
        },
        'generic': {
            message: 'Não entendi, mas amo jogos! Reformule ou diga "início" para voltar ao menu principal.'
        }
    };

    let currentNodeId = 'start'; // Start with the 'start' node

    // --- Helper Functions ---

    /**
     * Displays a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Hides the message box.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Adds a message to the conversation display.
     * @param {string} text - The message text.
     * @param {string} sender - 'bot' or 'user'.
     */
    function addMessageToDisplay(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar', `${sender}-avatar`);
        // Adicionar ícone simples para avatares melhores
        if (sender === 'bot') {
            avatarDiv.innerHTML = '🤖';
        } else {
            avatarDiv.innerHTML = '👤';
        }

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        conversationDisplay.appendChild(messageDiv);
        // Scroll to the bottom to show the latest message
        conversationDisplay.scrollTop = conversationDisplay.scrollHeight;
    }

    /**
     * Shows the typing indicator.
     */
    function showTyping() {
        typingIndicator.style.display = 'flex';
        conversationDisplay.scrollTop = conversationDisplay.scrollHeight;
    }

    /**
     * Hides the typing indicator.
     */
    function hideTyping() {
        typingIndicator.style.display = 'none';
    }

    /**
     * Processes user input to determine the next node based on keywords.
     * @param {string} inputText - The user's input text.
     * @returns {string} The next node ID.
     */
    function processUserInput(inputText) {
        const lowerInput = inputText.toLowerCase().trim();

        // Simple keyword mapping for intents
        if (lowerInput.includes('gênero') || lowerInput.includes('genero') || lowerInput.includes('tipo')) {
            return 'genres';
        } else if (lowerInput.includes('console')) {
            return 'consoles';
        } else if (lowerInput.includes('suporte') || lowerInput.includes('problema') || lowerInput.includes('ajuda')) {
            return 'support';
        } else if (lowerInput.includes('fps') || lowerInput.includes('shooter')) {
            return 'fps_info';
        } else if (lowerInput.includes('rpg') || lowerInput.includes('role')) {
            return 'rpg_info';
        } else if (lowerInput.includes('aventura') || lowerInput.includes('adventure')) {
            return 'adventure_info';
        } else if (lowerInput.includes('pc')) {
            return 'pc_gaming';
        } else if (lowerInput.includes('playstation') || lowerInput.includes('ps')) {
            return 'playstation';
        } else if (lowerInput.includes('xbox')) {
            return 'xbox';
        } else if (lowerInput.includes('lag') || lowerInput.includes('atraso')) {
            return 'lag_support';
        } else if (lowerInput.includes('crash') || lowerInput.includes('travar')) {
            return 'crash_support';
        } else if (lowerInput.includes('controle') || lowerInput.includes('controlador')) {
            return 'controller_support';
        } else if (lowerInput.includes('recomendação') || lowerInput.includes('recomendar')) {
            return 'recommendations';
        } else if (lowerInput.includes('sim') || lowerInput.includes('ok')) {
            return currentNodeId; // Stay or continue
        } else if (lowerInput.includes('não') || lowerInput.includes('nao')) {
            return 'end_conversation';
        } else if (lowerInput.includes('reiniciar') || lowerInput.includes('início') || lowerInput.includes('inicio')) {
            return 'start';
        } else {
            return 'generic';
        }
    }

    /**
     * Displays the bot's response for the current node.
     * @param {string} nodeId - The ID of the node to display.
     */
    function displayNode(nodeId) {
        const node = conversationNodes[nodeId];
        if (!node) {
            addMessageToDisplay('Erro: Resposta não encontrada. Vamos recomeçar.', 'bot');
            currentNodeId = 'start';
            return;
        }

        addMessageToDisplay(node.message, 'bot');
        currentNodeId = nodeId;
    }

    /**
     * Handles user input submission.
     */
    function handleUserInput() {
        const inputText = userInput.value.trim();
        if (!inputText) return;

        addMessageToDisplay(inputText, 'user');
        userInput.value = ''; // Clear input
        sendButton.disabled = true;

        // Show typing indicator
        showTyping();

        // Simulate processing delay
        setTimeout(() => {
            hideTyping();
            const nextNodeId = processUserInput(inputText);
            displayNode(nextNodeId);
            sendButton.disabled = false;
            userInput.focus();
        }, 1000 + Math.random() * 1000); // 1-2 seconds delay for "thinking"
    }

    /**
     * Restarts the conversation from the beginning.
     */
    function restartConversation() {
        if (confirm('Tem certeza que deseja reiniciar a conversa?')) {
            conversationDisplay.innerHTML = ''; // Clear all messages
            userInput.value = ''; // Clear input
            addMessageToDisplay('Bem-vindo ao Chat de Jogos! Como posso ajudar?', 'bot'); // Initial message
            currentNodeId = 'start';
            userInput.focus();
        }
    }

    // --- Event Listeners ---
    sendButton.addEventListener('click', handleUserInput);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });

    restartButton.addEventListener('click', restartConversation);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // Focus on input for better UX
    userInput.focus();

    // --- Initialization ---
    addMessageToDisplay('Olá! Bem-vindo ao Chat de Jogos. Digite sua mensagem para começar.', 'bot'); // Initial bot message
});
