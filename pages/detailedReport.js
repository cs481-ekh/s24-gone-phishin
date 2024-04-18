var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// Check if the analysis data is already stored in local storage
chrome.storage.local.get('analysisData', function(data) {
  if (data.analysisData) {
      // If data is found, update the HTML content with the stored analysis data
      updatePageWithData(data.analysisData);
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message type is 'analysisData'
  if (message.type === 'analysisData') {
      console.log("message received from background");
      // Update the page with the received analysis data
      updatePageWithData(message);
      // Store the analysis data in local storage for future use
      chrome.storage.local.set({ 'analysisData': message }, function() {
          console.log("Analysis data saved to local storage.");
      });
      sendResponse({ success: true });
  }
});

function updatePageWithData(data) {
  // Extract the data from the message
  const keywords = data.keywords;
  const spelling = data.spelling;
  const grammar = data.grammar;
  const hyperlinks = data.hyperlinks;
  const attachments = data.attachments;
  const numKeywords = data.numKeywords;
  const numSpelling = data.numSpelling;
  const numGrammar = data.numGrammar;
  const numAttachments = data.numAttachments;
  const score = data.score;
  const numHyperlinks = data.numHyperlinks;

  // Update the HTML content with the received data
  document.getElementById('keywords').innerHTML = keywords;
  document.getElementById('spelling').innerHTML = spelling;
  document.getElementById('grammar').innerHTML = grammar;
  document.getElementById('hyperlinks').innerHTML = hyperlinks;
  document.getElementById('attachments').innerHTML = attachments;
  document.getElementById('numKeywords').innerText = numKeywords;
  document.getElementById('numSpelling').innerText = numSpelling;
  document.getElementById('numGrammar').innerText = numGrammar;
  document.getElementById('numAttachments').innerText = numAttachments;
  document.getElementById('numHyperlinks').innerText = numHyperlinks;
  document.getElementById('score').innerText = score;

  var scoreElement = document.getElementById('score');
  if (parseFloat(score) <= 25) {
      scoreElement.style.backgroundColor = '#00ff00'; // green
  } else if (parseFloat(score) <= 50) {
      scoreElement.style.backgroundColor = '#ffff00'; // yellow
  } else if (parseFloat(score) <= 75) {
      scoreElement.style.backgroundColor = '#ff8800'; // orange
  } else {
      scoreElement.style.backgroundColor = '#ff0000'; // red
  }
}
