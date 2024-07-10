from flask import Flask, request, jsonify, render_template
import speech_recognition as sr
from googletrans import Translator
import base64
import io

app = Flask(__name__)

# Initialize the recognizer
r = sr.Recognizer()

# Function to recognize speech and translate
def recognize_and_translate(audio_data, target_lang='en'):
    try:
        audio = sr.AudioFile(io.BytesIO(audio_data))
        with audio as source:
            audio_data = r.record(source)
        text = r.recognize_google(audio_data)
        print(f"You said: {text}")

        translator = Translator()
        detected_lang = translator.detect(text).lang
        print(f"Detected language: {detected_lang}")

        translated_text = translator.translate(text, src=detected_lang, dest=target_lang).text
        print(f"Translated text: {translated_text}")
        return text, translated_text

    except sr.UnknownValueError:
        return "Google Speech Recognition could not understand audio", None

    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}", None

    except ValueError as e:
        return f"Translation error: {e}", None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/microphone', methods=['POST'])
def microphone():
    data = request.get_json()
    audio_data = base64.b64decode(data['audio_data'].split(',')[1])
    text, translated_text = recognize_and_translate(audio_data)
    return jsonify({"recognized_text": text, "translated_text": translated_text})

if __name__ == "__main__":
    app.run(debug=True)
