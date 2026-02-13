from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the model
model = None
try:
    model = tf.keras.models.load_model('cat_dog_model.h5')
    print("Model loaded successfully")
except Exception as e:
    print(f"Model not found or error loading model: {e}")

def predict_image(img_path):
    """Predict if image is a cat or dog"""
    if model is None:
        return "Model not loaded", 0.0
    
    try:
        img = image.load_img(img_path, target_size=(128, 128))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        prediction = model.predict(img_array, verbose=0)
        confidence = float(prediction[0][0])
        
        # prediction > 0.5 means Dog, else Cat
        if confidence > 0.5:
            return "Dog", confidence * 100
        else:
            return "Cat", (1 - confidence) * 100
    except Exception as e:
        print(f"Error during prediction: {e}")
        return "Error", 0.0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'})
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload an image.'})
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        result, confidence = predict_image(filepath)
        return jsonify({
            'result': result,
            'confidence': f"{confidence:.2f}%",
            'image_url': filepath
        })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=7860)
