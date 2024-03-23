// Displays interface, credit to ChatGPT
let receivedKWs;
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
    // Event Timestamp
    chrome.runtime.sendMessage({ enabled: isEnabled });
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
  } else if (message.keywords) {
    receivedKWs = message.keywords;
    console.log('Received keywords from background:', keywords);
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
  const titleDiv = document.createElement('div');
  titleDiv.id = 'sidebarTitle';
  titleDiv.textContent = 'Hook, Line, and Secure';
  titleDiv.style.padding = '10px';
  titleDiv.style.backgroundColor = 'blue';
  titleDiv.style.color = 'white';

  // Create a div element for the email analysis contents
  const analysisDiv = document.createElement('div');
  analysisDiv.id = 'analysisDiv'; // Set an id for the div
  analysisDiv.style.overflowY = 'scroll'; // Add scroll behavior if needed
  analysisDiv.style.height = '89%'; // Set height to fill the sidebar
  analysisDiv.style.padding = '10px'; // Add padding for spacing
  analysisDiv.style.boxSizing = 'border-box'; // Include padding in width calculation

  const spellingButton = document.createElement('button');
  spellingButton.class = "collapsible";
  spellingButton.style.backgroundColor = "#ccc";
  spellingButton.style.color = "#222";
  spellingButton.style.cursor = "pointer";
  spellingButton.style.padding = "18px";
  spellingButton.style.width = '100%';
  spellingButton.style.border = 'none';
  spellingButton.style.textAlign = 'left';
  spellingButton.style.outline = 'none';
  spellingButton.style.fontSize = '20px';

  const spellingDiv = document.createElement('div');
  spellingDiv.id = 'spellingDiv';
  spellingDiv.style.display = 'none';

  const grammarButton = document.createElement('button');
  grammarButton.class = "collapsible";
  grammarButton.style.backgroundColor = "#ccc";
  grammarButton.style.color = "#222";
  grammarButton.style.cursor = "pointer";
  grammarButton.style.padding = "18px";
  grammarButton.style.width = '100%';
  grammarButton.style.border = 'none';
  grammarButton.style.textAlign = 'left';
  grammarButton.style.outline = 'none';
  grammarButton.style.fontSize = '20px';

  const grammarDiv = document.createElement('div');
  grammarDiv.id = 'grammarDiv';
  grammarDiv.style.display = 'none';

  //TEST CODE
  const scoreBodyDiv = document.createElement('div');
  scoreBodyDiv.id = 'scoreBodyDiv';
  scoreBodyDiv.style.height = '2%';
  scoreBodyDiv.style.padding = '10px';
  scoreBodyDiv.textContent = "Confidence Score: 100%";

  //TEST
  const matchedDiv = document.createElement('div');
  matchedDiv.id = 'matchedDiv';
  matchedDiv.style.padding = '10px';

  // Append the titleDiv to the sidebarDiv
  sidebarDiv.appendChild(titleDiv);

  // Append the analysisDiv to the sidebarDiv
  sidebarDiv.appendChild(scoreBodyDiv);
  sidebarDiv.appendChild(analysisDiv);

  //TEST CODE
  analysisDiv.appendChild(spellingButton);
  analysisDiv.appendChild(spellingDiv);
  analysisDiv.appendChild(grammarButton);
  analysisDiv.appendChild(grammarDiv);
  analysisDiv.appendChild(matchedDiv);

  // Append the tab to the document body
  document.body.appendChild(tab);

  let matchedKeywords = [];

  // Function to tokenize email contents
  function tokenizeEmailContents(emailBody) {
      // Split email contents into tokens
      const tokens = emailBody.split(/\s+|[^\w\s'/%]+/);
  
      // Remove unneccessary tokens
      const filteredTokens = tokens.filter(token => token !== '' && token !== '‌');

      filteredTokens.forEach(token => {
          const lowercaseToken = token.toLowerCase();
          receivedKWs.forEach(keyword => {
              const lowercaseKeyword = keyword.keyword.toLowerCase();
              if (lowercaseKeyword === lowercaseToken && !matchedKeywords.some(item => item.keyword.toLowerCase() === lowercaseKeyword)) {
                  matchedKeywords.push({ keyword: keyword.keyword, riskScore: keyword.riskScore });
              }
          });
      });
      // Display matched keywords
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
          // analysisDiv.textContent = tokens.join(' || ');
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

    if(matchedKeywords) {
      console.log(matchedKeywords);
      let matchedKeywordsText = '';
      matchedKeywords.forEach(({ keyword, riskScore }) => {
        matchedKeywordsText += `${keyword} : ${riskScore}\n`;
      });
      console.log(matchedKeywordsText);
      matchedDiv.textContent = "yo " + matchedKeywordsText;
    }

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
        
        //Extract spelling info
        let spellingCount = spellingErrors ? spellingErrors.length : 0;
        spellingButton.innerHTML = "<b>Spelling Errors: " + spellingCount + "</b>";
        let spellingString = "<br>Often a multitude of spelling errors can be a sign of phishing. Spelling factors into 25% of the phishing score.<br><br>";
        spellingErrors.forEach(error => {
          spellingString += "Context: " + error.context.text + "<br><br>";
        })

        spellingButton.addEventListener("click", function() {
          if(spellingDiv.style.display === 'block'){
            spellingDiv.style.display = 'none';
          } else {
            spellingDiv.style.display = 'block';
          }
        })

        //Extract grammar info
        let grammarCount = grammarErrors ? grammarErrors.length : 0; 
        grammarButton.innerHTML = "<b>Grammar Errors: " + grammarCount + "</b>";
        let grammarString = "<br>Often a multitude of grammar errors can be a sign of phishing. Grammar factors into 25% of the phishing score.<br><br>";
        grammarErrors.forEach(error => {
          grammarString += "Error: " + error.message + "<br>";
          grammarString += "Context: " + error.context.text + "<br><br>";
        })

        grammarButton.addEventListener("click", function() {
          if(grammarDiv.style.display === 'block'){
            grammarDiv.style.display = 'none';
          } else {
            grammarDiv.style.display = 'block';
          }

        spellingDiv.innerHTML = spellingString;
        grammarDiv.innerHTML = grammarString;

        // #TODO handle comparisons with keywords
        const keywordScore = 0;
        if(matchedKeywords) {
          console.log(matchedKeywords);
          let matchedKeywordsText = '';
          matchedKeywords.forEach(({ keyword, riskScore }) => {
            matchedKeywordsText += `${keyword} : ${riskScore}\n`;
          });
          matchedDiv.textContent = matchedKeywordsText;
      }
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
          const scoreString = ("Confidence Score: " + confidenceScore.toFixed(2) + '%');
          scoreBodyDiv.textContent = scoreString;
          if(confidenceScore <= 25){
            scoreBodyDiv.style.backgroundColor = '#00ff00';
          } else if(confidenceScore <= 50){
            scoreBodyDiv.style.backgroundColor = '#ffff00';
          } else if(confidenceScore <= 75){
            scoreBodyDiv.style.backgroundColor = '#ff8800';
          } else {
            scoreBodyDiv.style.backgroundColor = '#ff0000';
          }
        }

      })
  });
})
}

// Function to remove sidebar elements
function removeSidebarElements() {
  // Select sidebar elements by their IDs
  const button = document.getElementById('sidebarButton');
  const titleBar = document.getElementById('sidebarTitle');
  const sidebarDiv = document.getElementById('sidebarDiv');
  const scoreBodyDiv = document.getElementById('scoreBodyDiv');
  const matchedDiv = document.getElementById('matchedDiv');

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
  if (scoreBodyDiv) {
    scoreBodyDiv.remove();
  }
  if (matchedDiv) {
    matchedDiv.remove();
  }
}