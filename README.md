# lithomage
A web-based application for generating custom lithophanes from uploaded images. This tool allows users to upload an image, adjust parameters like thickness and step size, preview the result, and download the generated STL file for 3D printing.

- Features:
Upload images in various formats (e.g., PNG, JPEG).
Generate and view a preview of the lithophane before downloading.

- Adjustable Parameters:
Minimum and Maximum Thickness.
Step Size for detail granularity.
Invert Colors option.
Color Picker for custom visualization.

- Technologies Used:
Frontend: HTML, CSS, JavaScript
Backend: Python (Flask)
NumPy: For image manipulation.
PIL (Pillow): For image processing.
Custom CSS.

- Usage:
Upload an image using the "Choose File" button.
Adjust parameters (min thickness, max thickness, step size, etc.) using the sliders.
Click the Generate Preview button to preview the lithophane.
Once satisfied, click Generate Lithophane to download the STL file.

Screenshot:
![image](https://github.com/user-attachments/assets/ef98f53a-0dc0-4325-8261-218a016d0ca6)

