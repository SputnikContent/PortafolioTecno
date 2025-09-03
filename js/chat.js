document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del Modal del Chat
    const chatModal = document.getElementById('chat-modal');
    const closeBtn = document.querySelector('.close-btn');
    const chatBtnContainer = document.querySelector('.chat-btn-container');

    // 2. Elementos del Chat
    const chatBody = document.querySelector('.chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-button');

    // 3. API de Gemini
    const API_KEY = 'AIzaSyD5kqoE6Y9_-fUAZDZpoRaniCuIJdXqqO4';
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // 4. Funciones para la interfaz del chat
    // Función para mostrar el modal
    chatBtnContainer.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que el enlace recargue la página
        chatModal.style.display = 'block';
    });

    // Función para cerrar el modal
    closeBtn.addEventListener('click', () => {
        chatModal.style.display = 'none';
    });

    // Cierra el modal si se hace clic fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });

    // Función para agregar un mensaje al chat
    const appendMessage = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Desplazar al final
    };

    // 5. Lógica del Chat
    const sendMessage = async () => {
        const userPrompt = userInput.value.trim();
        if (userPrompt === '') {
            return;
        }

        // Mostrar el mensaje del usuario en el chat
        appendMessage('user', userPrompt);
        userInput.value = '';

        // Mostrar un mensaje de "cargando..." de la IA
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('chat-message', 'ai-message', 'loading');
        loadingMessage.textContent = 'Escribiendo...';
        chatBody.appendChild(loadingMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        sendBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': API_KEY
                },
                body: JSON.stringify({
                    "contents": [
                        {
                            "parts": [
                                { "text": userPrompt }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const iaResponse = data.candidates[0].content.parts[0].text;

            // Eliminar el mensaje de carga y mostrar la respuesta de la IA
            chatBody.removeChild(loadingMessage);
            appendMessage('ai', iaResponse);

        } catch (error) {
            console.error('Error al llamar a la API:', error);
            chatBody.removeChild(loadingMessage);
            appendMessage('ai', 'Lo siento, no pude obtener una respuesta. Inténtalo de nuevo más tarde.');
        } finally {
            sendBtn.disabled = false;
        }
    };

    // 6. Asignar eventos a los botones
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
});
