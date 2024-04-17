// background.js

// Listen for changes to the 'enabled' key in storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.enabled) {
      var enabled = changes.enabled.newValue;
      console.log('Toggle state changed to:', enabled);
  
      // Send message to other components
      chrome.tabs.query({active: true}, function(tabs) {
        tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(tab.id, { enabled: enabled });
        });
      });
    }
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.keywords) {
      const keywords = message.keywords;
  
      // Forward the keywords array to uiDisp.js
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { keywords: keywords });
      });
    }

    if (message.type === 'analysisData') {
      console.log("message received: " + message);
      // Send the message to the content script (detailedreport.js)
      chrome.tabs.query({ url: chrome.runtime.getURL('pages/detailedReport.html') }, function (tabs) {
          tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, message, function(response) {
                  if (!response) {
                      console.error("Failed to send message to detailedreport.js.");
                  }
              });
          });
      });
    }
  });
  