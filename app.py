from flask import Flask, request, send_file, render_template
import numpy as np
import os
from lithophane import preprocess_image, save_as_stl

app = Flask(__name__, template_folder="template")

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-lithophane', methods=['POST'])
def generate_lithophane():
    # Retrieve parameters
    min_thickness = float(request.form['min_thickness'])
    max_thickness = float(request.form['max_thickness'])
    step_size = float(request.form['step_size'])

    # Save the grayscale data
    image_data = request.files['image'].read()
    image_array = np.frombuffer(image_data, dtype=np.uint8).reshape((300, 300))

    # Generate lithophane
    height_map = preprocess_image(image_array, min_thickness, max_thickness)
    output_path = os.path.join(OUTPUT_FOLDER, 'lithophane.stl')
    save_as_stl(height_map, output_path, step_size)

    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
