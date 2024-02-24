// //Function to display interface, credit to ChatGPT

// var img = document.createElement('img');
    
// // Set the image source
// img.src = './images/logo.png'; // Provide the path to your image

// img.style.top = 0;
// img.style.left = 0;
// img.style.width = '100%';
// img.style.height = '100%';
// img.style.zIndex = 9999999; /* Ensures it's above other content */
// // img.style.pointerEvents = none; /* Allows interaction with elements behind the overlay */

// // Set alt-text
// img.alt = 'Hook, Line, and Secure Logo';

// // Append the image to the body
// document.body.appendChild(img);

// Create the tab
const tab = document.createElement('button');
tab.textContent = 'Tab'; // Set the text for the tab button
tab.style.position = 'fixed';
tab.style.right = '0';
tab.style.top = '50%';
tab.style.transform = 'translateY(-50%)';
tab.style.zIndex = '9999999';

// Create a sidebar within the Gmail interface
const sidebarDiv = document.createElement('div');
sidebarDiv.style.position = 'fixed';
sidebarDiv.style.top = '10%';
sidebarDiv.style.right = '-300px';
sidebarDiv.style.width = '15%';
sidebarDiv.style.height = '65%';
sidebarDiv.style.backgroundColor = 'white';
sidebarDiv.style.border = '1px solid black';
sidebarDiv.style.zIndex = '999999';

// Append the sidebarDiv to the document body
document.body.appendChild(sidebarDiv);

//TEST CODE
const testbutton = document.createElement('button');
testbutton.textContent = 'Test button'; // Set the text for the tab button
testbutton.style.position = 'fixed';
testbutton.style.right = '0';
testbutton.style.top = '50%';
testbutton.style.transform = 'translateY(-50%)';
testbutton.style.zIndex = '9999999';

sidebarDiv.appendChild(testbutton);
//TEST CODE

// Create a div element for the text
const textDiv = document.createElement('div');
textDiv.textContent = 'Hook, Line, and Secure';
textDiv.style.padding = '10px';
textDiv.style.backgroundColor = 'blue';
textDiv.style.color = 'white';

// Append the textDiv to the sidebarDiv
sidebarDiv.appendChild(textDiv);

// Append the tab to the document body
document.body.appendChild(tab);

// Add event listener to the tab
tab.addEventListener('click', () => {
    // Toggle the visibility of the sidebar
    sidebarDiv.style.right = sidebarDiv.style.right === '0px' ? '-300px' : '0px';

    // Check if the sidebar is visible
    const isVisible = sidebarDiv.style.right === '0px';

    // Calculate the new width for the gmail interface
    const newWidth = isVisible ? `calc(95% - ${sidebarDiv.style.width})` : '100%';

    // Move the gmail interface
    document.querySelector('.bkK>.nH').style.width = newWidth;

    // Move the tab button
    tab.style.right = isVisible ? sidebarDiv.style.width : '0px';
});

testbutton.addEventListener("DOMContentLoaded", function() {
    const getDataButton = document.getElementById("getDataButton");
  
    getDataButton.addEventListener("click", function() {
      chrome.runtime.sendMessage({ action: "getData" }, function(response) {
        if (response.success) {
          console.log("Data from API:", response.data);
          // Do something with the data, e.g., display it in the popup
          // Note: This is just a basic example. You might want to update the UI more gracefully.
          const matchesArray = response.data.matches;
          const matchesCount = matchesArray ? matchesArray.length : 0;
          document.body.innerHTML = `<pre>${JSON.stringify(matchesCount - 1, null, 2)}</pre>`;
        } else {
          console.error("Failed to get data:", response.error);
          // Handle error, e.g., display error message in the popup
          document.body.innerHTML = `<p>Error: ${response.error}</p>`;
        }
      });
    });
  });