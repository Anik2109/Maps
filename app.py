import speech_recognition as sr
from googletrans import Translator  # Use googletrans for translation
import pyaudio

# Initialize the recognizer
r = sr.Recognizer()

# Function to capture audio from the microphone
def capture_audio():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16  # Audio format
    CHANNELS = 1  # Number of audio channels (1 for mono)
    RATE = 44100  # Sample rate (samples per second)
    RECORD_SECONDS = 5  # Duration of recording in seconds

    p = pyaudio.PyAudio()

    # Open the microphone stream
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("Recording...")
    frames = []

    for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()

    # Join the frames and return audio data and sample rate
    audio_data = b''.join(frames)
    return audio_data, RATE

# Function to recognize speech and translate
def recognize_and_translate(audio_data, target_lang='en'):
    try:
        # Convert raw audio data to AudioData object
        audio_data = sr.AudioData(audio_data, 44100, 2)  # 2 is the number of bytes per sample for 16-bit audio
        text = r.recognize_google(audio_data)
        print(f"You said: {text}")

        # Initialize the Translator
        translator = Translator()
        
        # Detect the language of the recognized text
        detected_lang = translator.detect(text).lang
        print(f"Detected language: {detected_lang}")

        # Translate the recognized speech
        translated_text = translator.translate(text, src=detected_lang, dest=target_lang).text  # Translate to target language
        
        if translated_text is None:
            raise ValueError("Translation failed. No translated text received.")

        print(f"Translated text: {translated_text}")

    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")

    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")

    except ValueError as e:
        print(f"Translation error: {e}")

# Main program
if __name__ == "__main__":
    audio_data, rate = capture_audio()
    recognize_and_translate(audio_data)

