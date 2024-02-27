// Function to display interface, credit to ChatGPT

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
sidebarDiv.style.height = '70%';
sidebarDiv.style.backgroundColor = 'white';
sidebarDiv.style.border = '1px solid black';
sidebarDiv.style.zIndex = '999999';

// Append the sidebarDiv to the document body
document.body.appendChild(sidebarDiv);

// Create a div element for the title text
const textDiv = document.createElement('div');
textDiv.textContent = 'Hook, Line, and Secure';
textDiv.style.padding = '10px';
textDiv.style.backgroundColor = 'blue';
textDiv.style.color = 'white';

// Create a div element for the email body contents
const emailBodyDiv = document.createElement('div');
emailBodyDiv.id = 'emailBodyDiv'; // Set an id for the div
emailBodyDiv.style.overflowY = 'scroll'; // Add scroll behavior if needed
emailBodyDiv.style.height = '94%'; // Set height to fill the sidebar
emailBodyDiv.style.padding = '10px'; // Add padding for spacing
emailBodyDiv.style.boxSizing = 'border-box'; // Include padding in width calculation

//TEST CODE
const smBodyDiv = document.createElement('div');
smBodyDiv.id = 'smBodyDiv';
smBodyDiv.style.padding = '10px';
smBodyDiv.textContent = '0';

// Append the textDiv to the sidebarDiv
sidebarDiv.appendChild(textDiv);

// Append the emailBodyDiv to the sidebarDiv
sidebarDiv.appendChild(emailBodyDiv);

//TEST CODE
sidebarDiv.appendChild(smBodyDiv);

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

    // Create a MutationObserver to watch for changes to the email body
    const observer = new MutationObserver(() => {
    // Select the email body element
    const emailBody = document.querySelector('.a3s.aiL');
  
    // Check if the email body is present and contains text
    if (emailBody && emailBody.textContent) {
      // Display the email body contents in the new div
      emailBodyDiv.textContent = emailBody.textContent;
    }
  });
  
  // Configure the observer to watch for changes to the email body subtree
  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
});

// Create the test button
const testButton = document.createElement('button');
testButton.textContent = 'Check Spelling';
testButton.style.margin = '10px'; // Add some margin for spacing

// Append the test button to the sidebar
sidebarDiv.appendChild(testButton);

document.addEventListener("DOMContentLoaded", function() {
    
      testButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "getData" }, function(response) {
          if (response.success) {
            console.log("Data from API:", response.data);
            // Do something with the data, e.g., display it in the popup
            // Note: This is just a basic example. You might want to update the UI more gracefully.
            const matchesArray = response.data.matches;
            const matchesCount = matchesArray ? matchesArray.length : 0;
            smBodyDiv.textContent = `<pre>${JSON.stringify(matchesCount - 1, null, 2)}</pre>`;
          } else {
            console.error("Failed to get data:", response.error);
            // Handle error, e.g., display error message in the popup
            document.body.innerHTML = `<p>Error: ${response.error}</p>`;
          }
        });
      });
    });



