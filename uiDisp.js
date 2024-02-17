//Function to display interface, credit to ChatGPT

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

// Create a window within the Gmail interface
const windowDiv = document.createElement('div');
windowDiv.style.position = 'fixed';
windowDiv.style.top = '50%';
windowDiv.style.right = '0';
windowDiv.style.transform = 'translateY(0)';
windowDiv.style.width = '250px';
windowDiv.style.height = '600px';
windowDiv.style.zIndex = 9999999;
windowDiv.style.backgroundColor = 'white';
windowDiv.style.border = '1px solid black';

// Append the windowDiv to the document body
document.body.appendChild(windowDiv);

// Create a div element for the text
const textDiv = document.createElement('div');
textDiv.textContent = 'Hook, Line, and Secure';
textDiv.style.padding = '10px';
textDiv.style.backgroundColor = 'blue';
textDiv.style.color = 'white';

// Append the textDiv to the windowDiv
windowDiv.appendChild(textDiv);