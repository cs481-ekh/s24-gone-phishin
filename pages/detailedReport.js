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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Check if the message type is 'analysisData'
    if (message.type === 'analysisData') {
        console.log("message received from background");
      // Extract the data from the message
      const keywords = message.keywords;
      const spelling = message.spelling;
      const grammar = message.grammar;
      const hyperlinks = message.hyperlinks;
  
      // Update the HTML content with the received data
      document.getElementById('keywords').innerHTML = keywords;
      document.getElementById('spelling').innerHTML = spelling;
      document.getElementById('grammar').innerHTML = grammar;
      document.getElementById('hyperlinks').innerHTML = hyperlinks;

      sendResponse({ success: true });
    }
  });