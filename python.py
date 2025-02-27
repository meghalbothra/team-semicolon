from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import speech_recognition as sr

def record_and_analyze():
    # Initialize the recognizer and sentiment analyzer
    recognizer = sr.Recognizer()
    analyzer = SentimentIntensityAnalyzer()

    # Use the microphone to capture audio
    with sr.Microphone() as source:
        print("Please speak now...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        audio_data = recognizer.listen(source)

    # Transcribe the audio to text using Google Speech Recognition
    try:
        text = recognizer.recognize_google(audio_data, language='en-US')
        print("You said:", text)
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
        return
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
        return

    # Analyze the sentiment of the transcribed text
    sentiment = analyzer.polarity_scores(text)
    print("Sentiment analysis:", sentiment)

    # Simple crisis alert based on a threshold for the compound score
    if sentiment['compound'] < -0.5:
        print("Crisis Alert: High negative sentiment detected!")
    else:
        print("Sentiment is within normal range.")

if __name__ == "__main__":
    record_and_analyze()
