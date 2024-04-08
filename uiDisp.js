// Displays interface, credit to ChatGPT
let receivedKWs;
let matchedKeywords = [];
let hyperlinks = [];

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
    receivedKWs = keywords;
    console.log('Received keywords from background:', keywords);
  }
})

function splitTextIntoChunks(text, wordsPerChunk) {
  // Initialize variables
  let chunks = [];
  let currentChunk = '';

  if (text === null) {
    return chunks;
  }
  // Split the text into words
  const words = text.split(/\s+/);

  // Iterate through the words
  for (let i = 0; i < words.length; i++) {
    // Add the current word to the current chunk
    currentChunk += words[i] + ' ';

    // Check if the current chunk reaches the desired word count or if it's the last word
    if ((i + 1) % wordsPerChunk === 0 || i === words.length - 1) {
      // Push the current chunk to the chunks array
      chunks.push(currentChunk.trim());

      // Reset the current chunk
      currentChunk = '';
    }
  }

  return chunks;
}

// Function to inject sidebar elements
function injectSidebarElements() {
  // Create the tab button
  const tab = document.createElement('button');
  tab.id = 'sidebarButton';
  tab.textContent = 'Tab'; // Set the text for the tab button
  tab.style.position = 'fixed';
  tab.style.right = '0';
  tab.style.top = '50%';
  tab.style.transform = 'translateY(-50%)';
  tab.style.zIndex = '1000000000000000';

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
  sidebarDiv.style.zIndex = '1';

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

  const rescanButton = document.createElement('button');
  rescanButton.textContent = "Rescan email";
  rescanButton.style.marginBottom = '5px';
  rescanButton.style.cursor = "pointer";

  const spellingButton = document.createElement('button');
  spellingButton.class = "collapsible";
  spellingButton.style.backgroundColor = "#ccc";
  spellingButton.style.color = "#222";
  spellingButton.style.cursor = "pointer";
  spellingButton.style.padding = "18px";
  spellingButton.style.marginTop = '5px';
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
  grammarButton.style.marginTop = '5px';
  grammarButton.style.width = '100%';
  grammarButton.style.border = 'none';
  grammarButton.style.textAlign = 'left';
  grammarButton.style.outline = 'none';
  grammarButton.style.fontSize = '20px';

  const grammarDiv = document.createElement('div');
  grammarDiv.id = 'grammarDiv';
  grammarDiv.style.display = 'none';

  const scoreBodyDiv = document.createElement('div');
  scoreBodyDiv.id = 'scoreBodyDiv';
  scoreBodyDiv.style.height = '2%';
  scoreBodyDiv.style.padding = '10px';

  const matchedButton = document.createElement('button');
  matchedButton.class = "collapsible";
  matchedButton.style.backgroundColor = "#ccc";
  matchedButton.style.color = "#222";
  matchedButton.style.cursor = "pointer";
  matchedButton.style.padding = "18px";
  matchedButton.style.marginTop = '5px';
  matchedButton.style.width = '100%';
  matchedButton.style.border = 'none';
  matchedButton.style.textAlign = 'left';
  matchedButton.style.outline = 'none';
  matchedButton.style.fontSize = '20px';

  const matchedDiv = document.createElement('div');
  matchedDiv.id = 'matchedDiv';
  matchedDiv.style.display = 'none';

  const hyperlinkButton = document.createElement('button');
  hyperlinkButton.class = "collapsible";
  hyperlinkButton.style.backgroundColor = "#ccc";
  hyperlinkButton.style.color = "#222";
  hyperlinkButton.style.cursor = "pointer";
  hyperlinkButton.style.padding = "18px";
  hyperlinkButton.style.width = '100%';
  hyperlinkButton.style.border = 'none';
  hyperlinkButton.style.textAlign = 'left';
  hyperlinkButton.style.outline = 'none';
  hyperlinkButton.style.fontSize = '20px';

  const hyperlinkDiv = document.createElement('div');
  hyperlinkDiv.id = 'hyperlinkDiv';
  hyperlinkDiv.style.display = 'none';

  // Append the titleDiv to the sidebarDiv
  sidebarDiv.appendChild(titleDiv);

  // Append the analysisDiv to the sidebarDiv
  sidebarDiv.appendChild(scoreBodyDiv);
  sidebarDiv.appendChild(analysisDiv);

  //TEST CODE
  analysisDiv.appendChild(rescanButton);
  analysisDiv.appendChild(spellingButton);
  analysisDiv.appendChild(spellingDiv);
  analysisDiv.appendChild(grammarButton);
  analysisDiv.appendChild(grammarDiv);
  analysisDiv.appendChild(matchedButton);
  analysisDiv.appendChild(matchedDiv);
  analysisDiv.appendChild(hyperlinkButton);
  analysisDiv.appendChild(hyperlinkDiv);

  // Append the tab to the document body
  document.body.appendChild(tab);

  // Clear scan results
  function flush() {
    console.log("Flushing results");

    scoreString = ("Confidence Score: " + 0 + '%');
    scoreBodyDiv.textContent = scoreString;
    scoreBodyDiv.style.backgroundColor = '#00ff00';

    spellingButton.innerHTML = "<b>Spelling Errors: " + 0 + "</b>";
    
    grammarButton.innerHTML = "<b>Grammar Errors: " + 0 + "</b>";

    matchedButton.innerHTML = "<b>Keywords found: " + 0 + "</b>";

    hyperlinkButton.innerHTML = "<b>Hyperlinks Found: " + 0 + "</b>";
  }

  // Function to tokenize email contents
  function tokenizeEmailContents(emailContent) {
    // Split email contents into tokens
    matchedKeywords = [];
    const tokens = emailContent.split(/\s+|[^\w\s'/%]+/);

    // Remove unneccessary tokens
    const filteredTokens = tokens.filter(token => token !== '' && token !== '‌');

    filteredTokens.forEach(token => {
      const lowercaseToken = token.toLowerCase();
      receivedKWs.forEach(keyword => {
        const lowercaseKeyword = keyword.keyword.toLowerCase();
        if (lowercaseKeyword === lowercaseToken && !matchedKeywords.some(item => item.keyword.toLowerCase() === lowercaseKeyword)) {
          matchedKeywords.push({ keyword: keyword.keyword, riskScore: keyword.riskScore, description: keyword.description });
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
  });
  rescanButton.addEventListener('click', loadAnalysis);

  let needFlush = false;
  // Scan email upon opening
  window.onpopstate = function(event) {

    // Discard previous scan results if needed
    if (needFlush) {
      flush();
      needFlush = false;
    }

    // Get the url
    const currentUrl = window.location.href;

    // Count the number of forward slashes in the URL
    var numSlashes = (currentUrl.match(/\//g) || []).length;

    if (currentUrl.includes('#category/') || currentUrl.includes('#label/')) {
      numSlashes = numSlashes - 1;
    }

    if (numSlashes >= 7) {
      loadAnalysis();
    }
  }

  function loadAnalysis() {
    console.log("Scanning email");

    needFlush = true;

    var tokens = null;
    var numTokens = 0;

    // Grab the email body, subject, and sender
    const emailBody    = document.querySelector('.a3s.aiL');
    const emailSubject = document.querySelector('h2.hP');
    const emailSender  = document.querySelector('span.go');
    var emailContent = null;

    // Create a MutationObserver to watch for changes to the email body
    //const observer = new MutationObserver(() => {
    // Select the email body element
    // const emailBody = document.querySelector('.a3s.aiL');

      // Check if the email body is present and contains text
      if (emailBody && emailSubject) {
        // Concat each of the email segments
        emailContent = emailBody.textContent.concat(" " + emailSubject.textContent);
        
        //parse for hyperlinks
        hyperlinks = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(emailBody.innerHTML, 'text/html');
        const linkElements = doc.querySelectorAll('a');
        linkElements.forEach(link => {
          const href = link.getAttribute('href');
          if (!hyperlinks.some(existingLink => existingLink.getAttribute('href') === href)) {
            hyperlinks.push(link);
            console.log("Link: ", href);
          }
        })

        // Tokenize the email contents
        tokens = tokenizeEmailContents(emailContent);

      if (tokens.length > 0) {
        numTokens = tokens.length;
      }
    }
    //});

    // Configure the observer to watch for changes to the email body subtree
    // observer.observe(document.body, {
    //   subtree: true,
    //   childList: true,
    // });

    // if (matchedKeywords) {
    //   matchedKeywords = [];
    //   let matchedKeywordsText = '';
    //   matchedKeywords.forEach(({ keyword, riskScore, description }) => {
    //     matchedKeywordsText += `${keyword} : ${riskScore} : ${description}<br><br>`;
    //   });
    //   matchedDiv.textContent = " " + matchedKeywordsText;
    // }

    let spellingErrors = [];
    let grammarErrors = [];
    let apiPromises = [];
    let spellingString = "";
    let grammarString = "";
    let hyperlinkString = "";
    let spellingCount = 0;
    let grammarCount = 0;

    let chunks = [];
    if (emailContent) {
      chunks = splitTextIntoChunks(emailContent, 50);
    }

    chunks.forEach(chunk => {
      const params = new URLSearchParams();
      params.append("text", chunk);
      console.log(params.toString()); //FIXME debug
      const promise = fetch("https://api.languagetoolplus.com/v2/check", {
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
          const currMatches = data.matches; // Extracting the matches array
          console.log("Matches:", currMatches);
          currMatches.forEach(error => {
            if (error.shortMessage == "Spelling mistake") {
              spellingErrors.push(error)
            }
            else {
              grammarErrors.push(error)
            }
          })
        })
      apiPromises.push(promise);
    })

    Promise.all(apiPromises)
      .then(() => {
        //extract hyperlink info
        hyperlinkButton.innerHTML = "<b>Hyperlinks Found: " + hyperlinks.length + "</b>";
        hyperlinkString = "<br>Sometimes emails will include malicious links that are designed to harm your computer or steal your data. Hyperlinks don't factor into your phishing score, but you should always be aware and cautious when they're present. <br><br>";
        hyperlinkString += "<div style='word-wrap: break-word;'>";
        hyperlinks.forEach(link => {
          hyperlinkString += "Link: " + link + "<br><br>";
        })
        hyperlinkString += "</div>";

        //extract spelling info
        spellingCount = spellingErrors ? spellingErrors.length : 0;
        spellingButton.innerHTML = "<b>Spelling Errors: " + spellingCount + "</b>";
        spellingString = "<br>Often a multitude of spelling errors can be a sign of phishing. Spelling factors into 25% of the phishing score.<br><br>";
        spellingErrors.forEach(error => {
          spellingString += "Context: " + error.context.text + "<br><br>";
        })

        //Extract grammar info
        grammarCount = grammarErrors ? grammarErrors.length : 0;
        grammarButton.innerHTML = "<b>Grammar Errors: " + grammarCount + "</b>";
        grammarString = "<br>Often a multitude of grammar errors can be a sign of phishing. Grammar factors into 25% of the phishing score.<br><br>";
        grammarErrors.forEach(error => {
          grammarString += "Error: " + error.message + "<br>";
          grammarString += "Context: " + error.context.text + "<br><br>";
        })

        //keywords I guess
        var totalRiskScore = 0;
        // if (matchedKeywords) {
        let keyWordLog = "<br><b>Matched Words</b><br> Often times there are specific things and feelings a scammer will want from you. The words they choose will indicate what they want and are indicative of an attempt at phishing. The higher the score the higher the chance the word is indicative of phishing. <br><br>";
        console.log(matchedKeywords);
        let matchedKeywordsText = '';
        matchedKeywords.forEach(({ keyword, riskScore, description }) => {
          totalRiskScore = totalRiskScore + riskScore;
          matchedKeywordsText += `${keyword} : ${riskScore} : ${description}<br><br>`;
        });
        keyWordLog = keyWordLog + " " + matchedKeywordsText + "<br><br>";
        matchedDiv.innerHTML = keyWordLog;
        matchedButton.innerHTML = "<b>Keywords found: " + matchedKeywords.length + "</b>";
        // }
        if (numTokens > 0) {
          // Spelling errors
          const spellingScore = Math.min(((spellingCount / numTokens) * 500), 100);
          // Grammar errors
          const grammarScore = Math.min(((grammarCount / numTokens) * 300), 100);
          /// Keyword matches
          const keywordScore = Math.min(((totalRiskScore / numTokens) * 100), 100);
          // Confidence score algorithm
          const confidenceScore = (0.5 * keywordScore) + (0.25 * spellingScore) + (0.25 * grammarScore);
          // console.log(spellingCount);
          // console.log(numTokens);
          // console.log(spellingScore);
          // console.log(totalRiskScore);
          //console.log(grammarScore);
          var scoreString = ("Confidence Score: " + confidenceScore.toFixed(2) + '%');
          scoreBodyDiv.textContent = scoreString;
          if (confidenceScore <= 25) {
            scoreBodyDiv.style.backgroundColor = '#00ff00';
          } else if (confidenceScore <= 50) {
            scoreBodyDiv.style.backgroundColor = '#ffff00';
          } else if (confidenceScore <= 75) {
            scoreBodyDiv.style.backgroundColor = '#ff8800';
          } else {
            scoreBodyDiv.style.backgroundColor = '#ff0000';
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    spellingButton.addEventListener("click", function () {
      if (spellingDiv.style.display === 'block') {
        spellingDiv.style.display = 'none';
      } else {
        spellingDiv.style.display = 'block';
        spellingDiv.innerHTML = spellingString;
      }
    })

    grammarButton.addEventListener("click", function () {
      if (grammarDiv.style.display === 'block') {
        grammarDiv.style.display = 'none';
      } else {
        grammarDiv.style.display = 'block';
        grammarDiv.innerHTML = grammarString;
      }
    });

    matchedButton.addEventListener("click", function () {
      if (matchedDiv.style.display === 'block') {
        matchedDiv.style.display = 'none';
      } else {
        matchedDiv.style.display = 'block'
      }
    });

    hyperlinkButton.addEventListener("click", function () {
      if (hyperlinkDiv.style.display === 'block') {
        hyperlinkDiv.style.display = 'none';
      } else {
        hyperlinkDiv.style.display = 'block';
        hyperlinkDiv.innerHTML = hyperlinkString;
      }
    });

    // #TODO handle comparisons with keywords
    // const tempKeywordScore = 0;
    // if (matchedKeywords) {
    //   let keyWordLog = "<br><b>Matched Words</b><br> Often times there are specific things and feelings a scammer will want from you. The words they choose will indicate what they want and are indicative of an attempt at phishing. The higher the score the higher the chance the word is indicative of phishing. <br><br>";
    //   console.log(matchedKeywords);
    //   let matchedKeywordsText = '';
    //   matchedKeywords.forEach(({ keyword, riskScore }) => {
    //     matchedKeywordsText += `${keyword} : ${riskScore}<br>`;
    //   });
    //   keyWordLog = keyWordLog + " " + matchedKeywordsText + "<br><br>";
    //   matchedDiv.innerHTML = keyWordLog;
    //   matchedButton.innerHTML =  "<b>Keywords found: " + matchedKeywords.length + "</b>";
    // }
    // if (numTokens > 0) {
    //   console.log("bleh")
    //   // Spelling errors
    //   const spellingScore = Math.min(((spellingCount / numTokens) * 500), 100);
    //   // Grammar errors
    //   const grammarScore = Math.min(((grammarCount / numTokens) * 300), 100);
    //   /// Keyword matches
    //   const keywordScore = Math.min(((tempKeywordScore / numTokens) * 100), 100);
    //   // Confidence score algorithm
    //   const confidenceScore = (0.5 * keywordScore) + (0.25 * spellingScore) + (0.25 * grammarScore);
    //   console.log(spellingCount);
    //   console.log(numTokens);
    //   console.log(spellingScore);
    //   //console.log(grammarScore);
    //   const scoreString = ("Confidence Score: " + confidenceScore.toFixed(2) + '%');
    //   scoreBodyDiv.textContent = scoreString;
    //   if (confidenceScore <= 25) {
    //     scoreBodyDiv.style.backgroundColor = '#00ff00';
    //   } else if (confidenceScore <= 50) {
    //     scoreBodyDiv.style.backgroundColor = '#ffff00';
    //   } else if (confidenceScore <= 75) {
    //     scoreBodyDiv.style.backgroundColor = '#ff8800';
    //   } else {
    //     scoreBodyDiv.style.backgroundColor = '#ff0000';
    //   }
    // }
  }
}

// Function to remove sidebar elements
function removeSidebarElements() {
  // Select sidebar elements by their IDs
  const button = document.getElementById('sidebarButton');
  const titleBar = document.getElementById('sidebarTitle');
  const sidebarDiv = document.getElementById('sidebarDiv');
  const scoreBodyDiv = document.getElementById('scoreBodyDiv');
  const matchedDiv = document.getElementById('matchedDiv');
  const hyperlinkDiv = document.getElementById('hyperlinkDiv');
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
  if (hyperlinkDiv) {
    hyperlinkDiv.remove();
  }
}