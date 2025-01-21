// Handle preview generation
document.getElementById('previewButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');

    if (fileInput.files.length === 0) {
        alert('Please upload an image first.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        preview.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// Handle preview generation
document.getElementById('lithophaneForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const imageInput = document.getElementById('imageUpload').files[0];
    const invertColors = document.getElementById('invertColors').checked;
    const colorMap = document.getElementById('colorMap').value;

    if (!imageInput) {
        alert('Please upload an image to generate the lithophane.');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        ctx.drawImage(img, 0, 0, 300, 300);

        const imageData = ctx.getImageData(0, 0, 300, 300);

        const color = {
            r: parseInt(colorMap.slice(1, 3), 16),
            g: parseInt(colorMap.slice(3, 5), 16),
            b: parseInt(colorMap.slice(5, 7), 16),
        };

        const worker = new Worker('/static/js/worker.js');
        worker.postMessage({ imageData, invert: invertColors, color });

        worker.onmessage = async (e) => {
            const { grayscaleData } = e.data;

            // Show loading indicator
            document.getElementById('loading').style.display = 'block';

            try {
                // Prepare form data
                const formData = new FormData();
                formData.append('image', new Blob([grayscaleData]), 'image.dat');
                formData.append('min_thickness', document.getElementById('minThickness').value);
                formData.append('max_thickness', document.getElementById('maxThickness').value);
                formData.append('step_size', document.getElementById('stepSize').value);

                // Send request to backend
                console.log('Sending request to backend...');
                const response = await fetch('http://127.0.0.1:5000/generate-lithophane', {
                    method: 'POST',
                    body: formData,
                });

                // Hide loading indicator
                document.getElementById('loading').style.display = 'none';

                if (!response.ok) {
                    throw new Error('Failed to generate the lithophane.');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                // Trigger download
                const link = document.createElement('a');
                link.href = url;
                link.download = 'lithophane.stl';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log('STL file downloaded successfully.');
            } catch (error) {
                document.getElementById('loading').style.display = 'none';
                alert(`Error: ${error.message}`);
                console.error('Error during fetch:', error);
            }
        };
    };

    img.onerror = () => {
        alert('Failed to load the uploaded image. Please try again.');
    };

    img.src = URL.createObjectURL(imageInput);
});

// Function to update the value next to the slider dynamically
function updateValue(id, value) {
    document.getElementById(id).textContent = value;
}