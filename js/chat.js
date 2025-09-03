document.addEventListener("DOMContentLoaded", function() {
    // Selectores del modal (mostrar/ocultar)
    const chatBtn = document.querySelector('.chat-icon');
    const chatModal = document.getElementById('chat-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Selectores del chatbot (lógica de conversación)
    const chatBody = document.querySelector('.chat-body');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // ¡ADVERTENCIA! No uses esta clave en un proyecto público. Es solo para este ejemplo.
    const API_KEY = 'AIzaSyCnHKyvmsPX3cVx1E0CPNlgkPb_TtGIUlY';

    // Función para añadir un mensaje al chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Función para el primer mensaje del bot
    function initialMessage() {
        addMessage('¡Hola! Soy un asistente en crecimiento personal. ¿Quieres que hablemos de cómo convertir los problemas en oportunidades?', 'bot');
    }

    // El cerebro del bot: se comunica con la API de Gemini
    async function getBotResponse(userMessage) {
        addMessage('Pensando...', 'bot');
        const botThinkingMessage = chatBody.lastChild;

        const prompt = `Actúa como un chatbot que promueve el crecimiento personal. Responde a este mensaje de forma empática y reflexiva, utilizando las ideas sobre cómo los problemas y conflictos son oportunidades para crecer. Aquí está el contexto:
        "Los problemas y conflictos, aunque incómodos, son oportunidades para crecer, conocernos mejor y desarrollar nuevas capacidades. Viktor Frankl dijo: 'Cuando ya no somos capaces de cambiar una situación, nos encontramos ante el desafío de cambiarnos a nosotros mismos.' Los conflictos nos enseñan a relacionarnos con empatía y a buscar soluciones, no culpas."
        El usuario dice: "${userMessage}"`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            
            chatBody.removeChild(botThinkingMessage);

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const botResponse = data.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
            } else {
                addMessage('Lo siento, algo salió mal. Intenta de nuevo más tarde.', 'bot');
            }

        } catch (error) {
            console.error('Error al comunicarse con la IA:', error);
            addMessage('Ha ocurrido un error. No puedo responder en este momento.', 'bot');
        }
    }

    // Manejar el envío de mensajes
    function handleSendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;
        addMessage(userMessage, 'user');
        userInput.value = '';
        getBotResponse(userMessage);
    }
    
    // Muestra/oculta el modal al hacer clic en el ícono de chat
    chatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        chatModal.classList.toggle('active');
        if(chatModal.classList.contains('active')) {
             initialMessage();
        } else {
            // Limpia el chat al cerrarlo
            chatBody.innerHTML = '';
        }
    });

    // Oculta el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        chatModal.classList.remove('active');
        // Limpia el chat al cerrarlo
        chatBody.innerHTML = '';
    });

    // Eventos para el botón de enviar y la tecla Enter
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
});