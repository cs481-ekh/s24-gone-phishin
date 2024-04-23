// Displays interface, credit to ChatGPT
let receivedKWs; 
let matchedKeywords = [];
let hyperlinks = [];
let attachmentNames = [];

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
    receivedKWs = keywords.map(keyword => ({
      keyword: keyword.keyword.toLowerCase(),
      riskScore: keyword.riskScore,
      description: keyword.description
    }));
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
  sidebarDiv.style.border = '5px solid #88001b';
  sidebarDiv.style.zIndex = '1';

  // Append the sidebarDiv to the document body
  document.body.appendChild(sidebarDiv);

  // Create a div element for the title text
  const titleDiv = document.createElement('div');
  titleDiv.id = 'sidebarTitle';
  titleDiv.textContent = 'Hook, Line, and Secure';
  titleDiv.style.padding = '10px';
  titleDiv.style.backgroundColor = '#2196F3';
  titleDiv.style.color = 'white';

  // Create a div element for the email analysis contents
  const analysisDiv = document.createElement('div');
  analysisDiv.id = 'analysisDiv'; // Set an id for the div
  analysisDiv.style.overflowY = 'scroll'; // Add scroll behavior if needed
  analysisDiv.style.height = '89%'; // Set height to fill the sidebar
  analysisDiv.style.padding = '10px'; // Add padding for spacing
  analysisDiv.style.boxSizing = 'border-box'; // Include padding in width calculation
  analysisDiv.style.backgroundColor = '#ccc';

  const addResourceButton = document.createElement('button');
  addResourceButton.textContent = "Additional Resources";
  addResourceButton.style.marginBottom = '12px';
  addResourceButton.style.borderRadius = '5px';
  addResourceButton.style.cursor = "pointer";

  const rescanButton = document.createElement('button');
  rescanButton.textContent = "Rescan email";
  rescanButton.style.marginBottom = '5px';
  rescanButton.style.cursor = "pointer";

  const detailButton = document.createElement('button');
  detailButton.textContent = "More Details";
  detailButton.style.marginLeft = '5px';
  detailButton.style.marginBottom = '5px';
  detailButton.style.cursor = "pointer";
  detailButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'openAddRes'});
  });

  const reportButton = document.createElement('button');
  reportButton.textContent = "I've been scammed";
  reportButton.style.marginLeft = '5px';
  reportButton.style.marginBottom = '5px';
  reportButton.style.cursor = "pointer";
  reportButton.addEventListener('click', function () {
    window.open('https://www.ic3.gov/');
  });

  const spellingDiv = document.createElement('div');
  spellingDiv.style.backgroundColor = "#ccc";
  spellingDiv.style.color = "#222";
  spellingDiv.style.padding = "13px";
  spellingDiv.style.width = '100%';
  spellingDiv.style.border = '5px solid #88001b';
  spellingDiv.style.textAlign = 'left';
  spellingDiv.style.outline = 'none';
  spellingDiv.style.fontSize = '20px';

  const grammarDiv = document.createElement('div');
  grammarDiv.style.backgroundColor = "#ccc";
  grammarDiv.style.color = "#222";
  grammarDiv.style.padding = "13px";
  grammarDiv.style.width = '100%';
  grammarDiv.style.border = '5px solid #88001b';
  grammarDiv.style.textAlign = 'left';
  grammarDiv.style.outline = 'none';
  grammarDiv.style.fontSize = '20px';

  const scoreBodyDiv = document.createElement('div');
  scoreBodyDiv.id = 'scoreBodyDiv';
  scoreBodyDiv.style.height = '2%';
  scoreBodyDiv.style.padding = '10px';

  const matchedDiv = document.createElement('div');
  matchedDiv.style.backgroundColor = "#ccc";
  matchedDiv.style.color = "#222";
  matchedDiv.style.padding = "13px";
  matchedDiv.style.width = '100%';
  matchedDiv.style.border = '5px solid #88001b';
  matchedDiv.style.textAlign = 'left';
  matchedDiv.style.outline = 'none';
  matchedDiv.style.fontSize = '20px';

  const hyperlinkDiv = document.createElement('div');
  hyperlinkDiv.style.backgroundColor = "#ccc";
  hyperlinkDiv.style.color = "#222";
  hyperlinkDiv.style.padding = "13px";
  hyperlinkDiv.style.width = '100%';
  hyperlinkDiv.style.border = '5px solid #88001b';
  hyperlinkDiv.style.textAlign = 'left';
  hyperlinkDiv.style.outline = 'none';
  hyperlinkDiv.style.fontSize = '20px';

  const attachmentsDiv = document.createElement('div');
  attachmentsDiv.style.backgroundColor = "#ccc";
  attachmentsDiv.style.color = "#222";
  attachmentsDiv.style.padding = "13px";
  attachmentsDiv.style.width = '100%';
  attachmentsDiv.style.border = '5px solid #88001b';
  attachmentsDiv.style.textAlign = 'left';
  attachmentsDiv.style.outline = 'none';
  attachmentsDiv.style.fontSize = '20px';

  // Append the titleDiv to the sidebarDiv
  sidebarDiv.appendChild(titleDiv);

  // Append the analysisDiv to the sidebarDiv
  sidebarDiv.appendChild(scoreBodyDiv);
  sidebarDiv.appendChild(analysisDiv);

  //TEST CODE
  analysisDiv.appendChild(addResourceButton);
  analysisDiv.appendChild(rescanButton);
  analysisDiv.appendChild(detailButton);
  analysisDiv.appendChild(reportButton);
  analysisDiv.appendChild(spellingDiv);
  analysisDiv.appendChild(grammarDiv);
  analysisDiv.appendChild(matchedDiv);
  analysisDiv.appendChild(hyperlinkDiv);
  analysisDiv.appendChild(attachmentsDiv);

  // Append the tab to the document body
  document.body.appendChild(tab);

  // Clear scan results
  function flush() {
    console.log("Flushing results");

    scoreString = ("Confidence Score: " + 0 + '%');
    scoreBodyDiv.textContent = scoreString;
    scoreBodyDiv.style.backgroundColor = '#00ff00';

    spellingDiv.innerHTML = "<b>Spelling Errors: " + 0 + "</b>";
    
    grammarDiv.innerHTML = "<b>Grammar Errors: " + 0 + "</b>";

    matchedDiv.innerHTML = "<b>Keywords found: " + 0 + "</b>";

    hyperlinkDiv.innerHTML = "<b>Hyperlinks Found: " + 0 + "</b>";
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
        const lowercaseKeyword = keyword.keyword;
        if (lowercaseKeyword === lowercaseToken && !matchedKeywords.some(item => item.keyword === lowercaseKeyword)) {
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

  addResourceButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'openAddRes'});
  });

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
      setTimeout(function() {
        loadAnalysis();
      }, 1000);
    }
  }

  function loadAnalysis() {
    console.time('UID Disp Loading Time');
    console.log("Scanning email");

    needFlush = true;

    var tokens = null;
    var numTokens = 0;

    // Grab the email body, subject, and sender
    const emailBody    = document.querySelector('.a3s.aiL:last-of-type > :not(.HOEnZb.adl)');
    const emailSubject = document.querySelector('h2.hP');
    const emailSender  = document.querySelector('span.go');
    var emailContent = null;

      // Check if the email body is present and contains text
      if (emailBody && emailSubject) {
        // Concat each of the email segments
        emailContent = emailBody.textContent + " " + emailSubject.textContent;

        console.log("if emailbody reached");

        //find attachments
        // Select all elements with the class "aZo"
        var attachments = document.querySelectorAll('.aZo');

        // Get the count of attachments
        attachmentNames = [];
        attachments.forEach(function(attachment) {
          // Find the attachment name element within the attachment
          var attachmentNameElement = attachment.querySelector('.a3I');

          // Check if the attachment name element exists
          if (attachmentNameElement) {
            // Extract the text content of the attachment name element
            var attachmentName = attachmentNameElement.textContent;
            var cleanedAttachmentName = attachmentName.replace('Preview attachment', '').trim();
            attachmentNames.push(cleanedAttachmentName);
          }
        })

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
            if(error.message == "If a new sentence starts here, add a space and start with an uppercase letter." || error.context.text.includes("[object HTMLDivElement]")) {
              //do nothing
            }
            else if (error.shortMessage == "Spelling mistake") {
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
        //extract attachment info
        attachmentsDiv.innerHTML = "<b>Attachments Found: " + attachmentNames.length + "</b>";
        attachmentsString = "<br>Sometimes emails will include attachments that are designed to harm your computer. Attachmenets don't factor into your phishing score, but you should always think before you click. Never open attachments from unknown sources, and be catious of attachments with extensions like .exe<br><br>";
        attachmentsString += "<div style='word-wrap: break-word;'>";
        attachmentNames.forEach(attachment => {
          attachmentsString += "Attachment: " + attachment + "<br><br>";
        })
        attachmentsString += "</div>";

        //extract hyperlink info
        hyperlinkDiv.innerHTML = "<b>Hyperlinks Found: " + hyperlinks.length + "</b>";
        hyperlinkString = "<br>Sometimes emails will include malicious links that are designed to harm your computer or steal your data. Hyperlinks don't factor into your phishing score, but you should always be aware and cautious when they're present. <br><br>";
        hyperlinkString += "<div style='word-wrap: break-word;'>";
        hyperlinks.forEach(link => {
          hyperlinkString += "Link: " + link + "<br><br>";
        })
        hyperlinkString += "</div>";

        //extract spelling info
        spellingCount = spellingErrors ? spellingErrors.length : 0;
        spellingDiv.innerHTML = "<b>Spelling Errors: " + spellingCount + "</b>";
        spellingString = "<br>Often a multitude of spelling errors can be a sign of phishing. Spelling factors into 25% of the phishing score.<br><br>";
        spellingErrors.forEach(error => {
          spellingString += "Context: " + error.context.text + "<br><br>";
        })

        //Extract grammar info
        grammarCount = grammarErrors ? grammarErrors.length : 0;
        grammarDiv.innerHTML = "<b>Grammar Errors: " + grammarCount + "</b>";
        grammarString = "<br>Often a multitude of grammar errors can be a sign of phishing. Grammar factors into 25% of the phishing score.<br><br>";
        grammarErrors.forEach(error => {
          grammarString += "Error: " + error.message + "<br>";
          grammarString += "Context: " + error.context.text + "<br><br>";
        })
        var totalRiskScore = 0;
        let keyWordLog = "<br><b>Matched Words</b><br> Often times there are specific things and feelings a scammer will want from you. The words they choose will indicate what they want and are indicative of an attempt at phishing. The higher the score the higher the chance the word is indicative of phishing. <br><br>";
        console.log(matchedKeywords);
        let matchedKeywordsText = '';
        matchedKeywords.forEach(({ keyword, riskScore, description }) => {
          totalRiskScore = totalRiskScore + riskScore;
          matchedKeywordsText += `${keyword} : ${riskScore} : ${description}<br><br>`;
        });
        keyWordLog = keyWordLog + " " + matchedKeywordsText + "<br><br>";
        matchedDiv.innerHTML = "<b>Keywords found: " + matchedKeywords.length + "</b>";
        if (numTokens > 0) {
          // Spelling errors
          const spellingScore = Math.min(((spellingCount / numTokens) * 500), 100);
          // Grammar errors
          const grammarScore = Math.min(((grammarCount / numTokens) * 300), 100);
          /// Keyword matches
          const keywordScore = Math.min(((totalRiskScore / numTokens) * 100), 100);
          // Confidence score algorithm
          const confidenceScore = (0.5 * keywordScore) + (0.25 * spellingScore) + (0.25 * grammarScore);
          // If the email is "High risk" this sends a message to the background script to timestamp the occurence
          if(confidenceScore >= 75) {
            chrome.runtime.sendMessage({eventName: "High-Risk"});
          }
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
          const message = {
            type: 'analysisData',
            keywords: keyWordLog,
            spelling: spellingString,
            grammar: grammarString,
            hyperlinks: hyperlinkString,
            score: confidenceScore.toFixed(2),
            numKeywords: matchedKeywords.length,
            numSpelling: spellingErrors.length,
            numGrammar: grammarErrors.length,
            numHyperlinks: hyperlinks.length,
            attachments: attachmentsString,
            numAttachments: attachmentNames.length
          };
          console.log("reached");
          chrome.runtime.sendMessage(message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    console.timeEnd('UID Disp Loading Time');
  }
}

// Function to remove sidebar elements
function removeSidebarElements() {
  // Select sidebar elements by their IDs
  const sidebarButton = document.getElementById('sidebarButton');
  const sidebarTitle = document.getElementById('sidebarTitle');
  const sidebarDiv = document.getElementById('sidebarDiv');
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
  if (scoreBodyDiv) {
    scoreBodyDiv.remove();
  }
}