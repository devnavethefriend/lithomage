import numpy as np
from PIL import Image
from multiprocessing import Pool
import os

def preprocess_image(image_array, min_thickness=0.4, max_thickness=2.0):
    """Generate the height map from the image array."""
    normalized = image_array / 255.0
    return normalized * (max_thickness - min_thickness) + min_thickness

def _write_triangle(f, vertices):
    """Helper function to write STL triangles."""
    normal = (0.0, 0.0, 0.0)  # Placeholder normal
    f.write(f"facet normal {normal[0]} {normal[1]} {normal[2]}\n")
    f.write("  outer loop\n")
    for vertex in vertices:
        f.write(f"    vertex {vertex[0]} {vertex[1]} {vertex[2]}\n")
    f.write("  endloop\n")
    f.write("endfacet\n")

def save_as_stl(height_map, output_path, step_size=0.2):
    """Generate a 3D STL file from the height map."""
    with open(output_path, 'w') as f:
        f.write("solid lithophane\n")
        rows, cols = height_map.shape
        for i in range(rows - 1):
            for j in range(cols - 1):
                # Define vertices of the two triangles forming each quad
                v1 = (i * step_size, j * step_size, height_map[i, j])
                v2 = ((i + 1) * step_size, j * step_size, height_map[i + 1, j])
                v3 = (i * step_size, (j + 1) * step_size, height_map[i, j + 1])
                v4 = ((i + 1) * step_size, (j + 1) * step_size, height_map[i + 1, j + 1])

                # Write triangles
                _write_triangle(f, [v1, v2, v3])
                _write_triangle(f, [v3, v2, v4])

        f.write("endsolid lithophane\n")
    return output_path
