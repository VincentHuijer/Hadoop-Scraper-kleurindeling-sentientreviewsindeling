// Require the necessary modules
const fs = require('fs');
const request = require('request');
const sharp = require('sharp');

// Read the input JSON file
const inputFilePath = 'AmazonImages.json'; // Update with your input file path
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Failed to read input file: ${err.message}`);
    return;
  }

  try {
    const images = JSON.parse(data);

    // Function to resize an image to 500 x 500 pixels
    function resizeImage(imagePath) {
      return new Promise((resolve, reject) => {
        // Load the image using sharp
        sharp(imagePath)
          .resize(500, 500)
          .toBuffer((err, buffer) => {
            if (err) {
              reject(new Error(`Failed to resize image: ${imagePath}`));
            } else {
              resolve(buffer.toString('base64'));
            }
          });
      });
    }

    // Array to store resized image data
    const resizedImages = [];

    // Loop through the image URLs, download and save them locally, then resize each image
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const imagePath = `image_${i+1}.jpg`; // Create a unique file name for each image

      // Download the image and save it locally
      request(imageUrl).pipe(fs.createWriteStream(imagePath))
        .on('close', () => {
          console.log(`Downloaded and saved image ${i + 1}: ${imagePath}`);

          // Resize the image
          resizeImage(imagePath)
            .then((dataUrl) => {
              console.log(`Resized image ${i + 1}: ${dataUrl}`);
              resizedImages.push(dataUrl);

              // Check if all images have been resized
              if (resizedImages.length === images.length) {
                // Write the resized image data to a new JSON file
                const outputFilePath = 'output.json'; // Update with your output file path
                fs.writeFile(outputFilePath, JSON.stringify(resizedImages), 'utf8', (err) => {
                  if (err) {
                    console.error(`Failed to write output file: ${err.message}`);
                  } else {
                    console.log(`Resized image data has been written to ${outputFilePath}`);
                  }
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .on('error', (err) => {
          console.error(`Failed to download image ${i + 1}: ${imageUrl}`);
        });
    }
  } catch (error) {
    console.error(`Failed to parse input JSON: ${error.message}`);
  }
});
