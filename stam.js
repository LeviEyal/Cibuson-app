const fs = require('fs');

const base64Image = 'R0lGODdhWAICAMIFAM0Mg9ojd-g3bPNKYP9cWv___________ywAAAAAWAICAAADVwi63P4wykmrvSHrzbv_YCiOZGkKaKqubOu-cCzPdD3ceK7vfO__wKBwSCQYj8ikcslsOp_QqHR6qVqv2CzGxO16v-BSbUwum882onrNbruH07h8Tq9PEwA7';
const filePath = '/home/eyal/Desktop/mamish-app/output.gif';



// Convert base64 string to a buffer
const buffer = Buffer.from(base64Image, 'base64');

// Save the buffer to a file
fs.writeFile(filePath, buffer, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log(`File saved to ${filePath}`);
  }
});
