from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model
with open('weather_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from form
        features = [
            float(request.form.get('MinTemp', 0)),
            float(request.form.get('MaxTemp', 0)),
            float(request.form.get('Rainfall', 0)),
            float(request.form.get('Humidity9am', 0)),
            float(request.form.get('Humidity3pm', 0)),
            float(request.form.get('WindSpeed9am', 0)),
            float(request.form.get('WindSpeed3pm', 0)),
            float(request.form.get('Pressure9am', 0)),
            float(request.form.get('Pressure3pm', 0)),
            float(request.form.get('Temp9am', 0)),
            float(request.form.get('Temp3pm', 0)),
            1 if request.form.get('RainToday') == 'Yes' else 0
        ]

        prediction = model.predict([features])[0]

        if prediction == 0:
            result = 'Clear'
        else:
            result = 'Rain'

        return render_template('index.html', prediction=result)

    except Exception as e:
        return render_template('index.html', prediction=f"Error: {str(e)}")

if __name__ == "__main__":
    app.run(debug=True)
