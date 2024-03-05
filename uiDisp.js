// Displays interface, credit to ChatGPT

//Set starting state
chrome.storage.sync.get('enabled', function (result) {
  if (result.enabled) {
    injectSidebarElements();
  } else {
    //Do nothing, page doesn't need edited
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enabled !== undefined) {
    var isEnabled = message.enabled;
    console.log('Received toggle state:', isEnabled);

    // Trigger event or perform actions based on the received toggle state
    if (isEnabled) {
      // Inject content script
      console.log('Content script injected');
      injectSidebarElements();
      
    } else {
      // Remove content script
      console.log('Content script removed');
      removeSidebarElements();
    }
  }
})

// Function to inject sidebar elements
function injectSidebarElements() {
  // Create the tab
  const tab = document.createElement('button');
  tab.id = 'sidebarButton';
  tab.textContent = 'Tab'; // Set the text for the tab button
  tab.style.position = 'fixed';
  tab.style.right = '0';
  tab.style.top = '50%';
  tab.style.transform = 'translateY(-50%)';
  tab.style.zIndex = '9999999';

  // Create a sidebar within the Gmail interface
  const sidebarDiv = document.createElement('div');
  sidebarDiv.id = 'sidebarDiv';
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
  textDiv.id = 'sidebarTitle';
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
  smBodyDiv.textContent = "Spelling Errors: 0";

  //TEST CODE
  const gmBodyDiv = document.createElement('div');
  gmBodyDiv.id = 'gmBodyDiv';
  gmBodyDiv.style.padding = '10px';
  gmBodyDiv.textContent = "Grammar Errors: 0";

  //TEST CODE
  const scoreBodyDiv = document.createElement('div');
  scoreBodyDiv.id = 'scoreBodyDiv';
  scoreBodyDiv.style.adding = '10px';
  scoreBodyDiv.textContent = "Confidence Score: 100%";

  // Append the textDiv to the sidebarDiv
  sidebarDiv.appendChild(textDiv);

  // Append the emailBodyDiv to the sidebarDiv
  sidebarDiv.appendChild(emailBodyDiv);

  //TEST CODE
  sidebarDiv.appendChild(smBodyDiv);
  sidebarDiv.appendChild(gmBodyDiv);
  sidebarDiv.appendChild(scoreBodyDiv);

  // Append the tab to the document body
  document.body.appendChild(tab);

  // Function to tokenize email contents
  function tokenizeEmailContents(emailBody) {
    // Split email contents into tokens
    const tokens = emailBody.split(/\s+|[^\w\s'/%]+/);

    // Remove unneccessary tokens
    const filteredTokens = tokens.filter(token => token !== '' && token !== '‌');

    return filteredTokens;
  }

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

    var tokens = null;
    var numTokens = 0

    // Create a MutationObserver to watch for changes to the email body
    const observer = new MutationObserver(() => {
      // Select the email body element
      const emailBody = document.querySelector('.a3s.aiL');

      // Check if the email body is present and contains text
      if (emailBody && emailBody.textContent) {
        // Tokenize the email contents
        tokens = tokenizeEmailContents(emailBody.textContent);

        if (tokens.length > 0) {
          // Display the tokens in the sidebar
          emailBodyDiv.textContent = tokens.join(' || ');
          // Update numTokens
          numTokens = tokens.length;
        }
      }
    });

    // Configure the observer to watch for changes to the email body subtree
    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    //Call LangaugeTool API to check for spelling errors
    const params = new URLSearchParams();
    params.append("text", document.querySelector('.a3s.aiL').textContent);
    console.log(params.toString()); //FIXME debug
    fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: params.toString() + "&language=en-US&enabledOnly=false"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("API Response:", data);
        const matchesArray = data.matches; // Extracting the matches array
        console.log("Matches:", matchesArray);
        let spellingErrors = [];
        let grammarErrors = [];
        matchesArray.forEach(error => {
          if (error.shortMessage == "Spelling mistake") {
            spellingErrors.push(error)
          }
          else {
            grammarErrors.push(error)
          }
        })
        const spellingCount = spellingErrors ? spellingErrors.length : 0;
        const grammarCount = grammarErrors ? grammarErrors.length : 0;
        const spellingString = "Spelling Errors: " + spellingCount;
        const grammarString = "Grammar Errors: " + grammarCount;
        smBodyDiv.textContent = spellingString;
        gmBodyDiv.textContent = grammarString;

        // #TODO handle comparisons with keywords
        const keywordScore = 0;

        if (numTokens > 0) {
          // #TODO incorporate spelling errors
          const spellingScore = (spellingCount / numTokens) * 100;
          // #TODO incorporate grammar errors
          const grammarScore = (grammarCount / numTokens) * 100;
          // Confidence score algorithm
          const confidenceScore = (0.5 * keywordScore) + (0.25 * spellingScore) + (0.25 * grammarScore);
          console.log(spellingCount);
          console.log(numTokens);
          console.log(spellingScore);
          //console.log(grammarScore);
          const scoreString = ("Confidnce Score: " + confidenceScore.toFixed(2) + '%');
          scoreBodyDiv.textContent = scoreString;
        }

      })
  });
}

// Function to remove sidebar elements
function removeSidebarElements() {
  // Select sidebar elements by their IDs
  const button = document.getElementById('sidebarButton');
  const titleBar = document.getElementById('sidebarTitle');
  const sidebarDiv = document.getElementById('sidebarDiv');
  const smBodyDiv = document.getElementById('smBodyDiv');
  const gmBodyDiv = document.getElementById('gmBodyDiv');
  const scoreBodyDiv = document.getElementById('scoreBodyDiv');

  // Remove sidebar elements from the DOM if they exist
  if (sidebarButton) {
    sidebarButton.remove();
  }
  if (sidebarTitle) {
    sidebarTitle.remove();
  }
  if (sidebarDiv) {
    sidebarDiv.remove();
  }
  if (smBodyDiv) {
    smBodyDiv.remove();
  }
  if (gmBodyDiv) {
    gmBodyDiv.remove();
  }
  if (scoreBodyDiv) {
    scoreBodyDiv.remove();
  }
}