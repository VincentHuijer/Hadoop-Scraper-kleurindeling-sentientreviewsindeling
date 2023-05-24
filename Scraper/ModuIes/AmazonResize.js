const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolderPath = 'C:\Users\3dvec\OneDrive - De Haagse Hogeschool\Sem4\OneDrive - De Haagse Hogeschool\HadoopOpdracht\Scraper\OUDImages500x500'; // Update with the path to your input folder
const outputFolderPath = 'C:\Users\3dvec\OneDrive - De Haagse Hogeschool\Sem4\OneDrive - De Haagse Hogeschool\HadoopOpdracht\Scraper\NEWImages500x500'; // Update with the path to your output folder

// Read the files in the input folder
fs.readdir(inputFolderPath, (err, files) => {
  if (err) {
    console.error(`Failed to read input folder: ${err.message}`);
    return;
  }

  // Filter the JPG files
  const jpgFiles = files.filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'));

  // Loop through the JPG files and resize each image
  jpgFiles.forEach((file, index) => {
    const inputFilePath = path.join(inputFolderPath, file);
    const outputFilePath = path.join(outputFolderPath, file);

    // Load the image using sharp
    sharp(inputFilePath)
      .resize(500, 500)
      .toFile(outputFilePath, (err, info) => {
        if (err) {
          console.error(`Failed to resize image: ${inputFilePath}`);
        } else {
          console.log(`Resized image ${index + 1}: ${outputFilePath}`);
        }
      });
  });
});
