//Function to display image, credit to ChatGPT

var img = document.createElement('img');
    
// Set the image source
img.src = './images/logo.png'; // Provide the path to your image

img.style.top = 0;
img.style.left = 0;
img.style.width = '100%';
img.style.height = '100%';
img.style.zIndex = 9999999; /* Ensures it's above other content */
// img.style.pointerEvents = none; /* Allows interaction with elements behind the overlay */

// Set alt-text
img.alt = 'Hook, Line, and Secure Logo';

// Append the image to the body
document.body.appendChild(img);