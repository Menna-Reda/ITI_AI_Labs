from flask import Flask, render_template, jsonify, request
import requests
import openai
import time
import os
import random

app = Flask(__name__)

# Securely set your OpenAI API key using environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    model = request.json.get('model', 'gpt-3.5-turbo')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {openai.api_key}'
    }
    
    data = {
        "model": model,
        "messages": [{"role": "user", "content": user_message}],
        "max_tokens": 150
    }

    retries = 5
    for i in range(retries):
        try:
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=data
            )
            response.raise_for_status()  # Raises an error for 4xx and 5xx responses

            # Debugging: Print response headers and content for troubleshooting
            print("Response Content-Type:", response.headers.get("Content-Type"))
            print("Response Content:", response.text)

            # Ensure response is JSON
            if 'application/json' not in response.headers.get("Content-Type", ""):
                app.logger.error("Received non-JSON response from OpenAI API.")
                return jsonify({'error': 'Unexpected response format from OpenAI'}), 500

            response_json = response.json()
            return jsonify({'response': response_json['choices'][0]['message']['content'].strip()})

        except requests.exceptions.RequestException as e:
            if response.status_code == 429 and i < retries - 1:
                wait_time = 2 ** i + random.uniform(0, 0.5)  # Exponential backoff
                time.sleep(wait_time)
                continue
            app.logger.error(f"Request failed: {e}")
            return jsonify({'error': str(e)}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
