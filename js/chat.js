document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const submitBtn = document.getElementById('submit-btn');
    const responseOutput = document.getElementById('response-output');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Aquí está la clave de API de Gemini
    const API_KEY = 'AIzaSyD5kqoE6Y9_-fUAZDZpoRaniCuIJdXqqO4';
    // Este es el endpoint correcto para el modelo Gemini 2.0 Flash
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    submitBtn.addEventListener('click', async () => {
        const userPrompt = promptInput.value.trim();
        if (userPrompt === '') {
            alert('Por favor, escribe una consulta.');
            return;
        }

        responseOutput.textContent = '';
        loadingIndicator.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': API_KEY // La clave se envía en este encabezado
                },
                body: JSON.stringify({
                    "contents": [ // La API de Gemini usa "contents"
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
            
            // Acceso a la respuesta de Gemini en el formato correcto
            const iaResponse = data.candidates[0].content.parts[0].text;

            responseOutput.textContent = iaResponse;

        } catch (error) {
            console.error('Error al llamar a la API:', error);
            responseOutput.textContent = `Hubo un error al obtener la respuesta. Por favor, inténtalo de nuevo más tarde. Detalle: ${error.message}`;
        } finally {
            loadingIndicator.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});
