document.getElementById('send-button').addEventListener('click', function() {
    const userMessage = document.getElementById('user-message').value;
    const model = document.getElementById('model-select').value;

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage, model: model })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        const chatBox = document.getElementById('chat-box');
        const userMessageElement = document.createElement('div');
        userMessageElement.textContent = 'You: ' + userMessage;
        chatBox.appendChild(userMessageElement);

        const botMessageElement = document.createElement('div');
        if (data.error) {
            botMessageElement.textContent = 'Error: ' + data.error;
        } else {
            botMessageElement.textContent = 'Bot: ' + data.response;
        }
        chatBox.appendChild(botMessageElement);

        document.getElementById('user-message').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        const chatBox = document.getElementById('chat-box');
        const errorMessageElement = document.createElement('div');
        errorMessageElement.textContent = 'Error: ' + error.message;
        chatBox.appendChild(errorMessageElement);
    });
});
