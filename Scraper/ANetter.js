const fs = require('fs');

// Read the JSON file
fs.readFile('AmazonReviewsv2.json', 'utf-8', (err, data) => {
  if (err) throw err;

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Replace '","' including semicolons with '+'
  const jsonString = JSON.stringify(jsonData).replace(/","|;/g, '+');

  // Write the updated JSON data to a new file
  fs.writeFile('ReviewNetter.json', jsonString, 'utf-8', (err) => {
    if (err) throw err;
    console.log('JSON data has been updated and written to output.json');
  });
});
