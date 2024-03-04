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
  