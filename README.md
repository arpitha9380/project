# Cat vs Dog Image Classification

A simple web application built with Flask and TensorFlow/Keras that classifies images as either a **Cat** or a **Dog** using a Convolutional Neural Network (CNN).

## 🚀 Features

- **Image Upload:** Users can upload images in various formats (JPG, PNG, GIF, BMP).
- **CNN Classification:** Utilizes a pre-trained CNN model (`cat_dog_model.h5`) for accurate predictions.
- **Confidence Scoring:** Displays the prediction result along with a confidence percentage.
- **Web Interface:** Clean and responsive UI for easy interaction.

## 🛠️ Project Structure

- `app.py`: The main Flask application handling routing and predictions.
- `cat_dog_model.h5`: Pre-trained Keras model for classification.
- `requirements.txt`: List of Python dependencies.
- `templates/`: HTML templates for the web interface.
- `static/`: Static assets (CSS, images, uploads).
- `train_model.py`: Script used to train the model.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arpitha9380/project.git
   cd project
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## 🖥️ Usage

1. **Start the Flask server:**
   ```bash
   python app.py
   ```
2. **Access the application:**
   Open your browser and navigate to `http://127.0.0.1:5000`.

## 🧠 Model Details

The model is a Convolutional Neural Network trained on the Cat vs Dog dataset. It expects input images of size `128x128` pixels and uses a sigmoid activation function for binary classification.

## 🧰 Tech Stack

- **Backend:** Flask (Python)
- **Deep Learning:** TensorFlow, Keras
- **Data Processing:** NumPy, Pillow
- **Frontend:** HTML, CSS (Vanilla)

---

Developed by [arpitha9380](https://github.com/arpitha9380)
