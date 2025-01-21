onmessage = function (e) {
    const { imageData } = e.data;
    const width = imageData.width; // Should be 300
    const height = imageData.height; // Should be 300

    const grayscaleData = new Uint8Array(width * height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        grayscaleData[i / 4] = avg;
    }

    if (grayscaleData.length !== 300 * 300) {
        console.error('Grayscale data is not the correct size:', grayscaleData.length);
    }

    postMessage({ grayscaleData });
};
