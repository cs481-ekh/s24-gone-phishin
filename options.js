// options.js Starter code credit to ChatGPT
document.addEventListener('DOMContentLoaded', function () {
  var enableToggle = document.getElementById('enableToggle');
  console.log("test1")

  // Load settings
  chrome.storage.sync.get('enabled', function (result) {
    enableToggle.checked = result.enabled || false;
    console.log("test")
  });

  enableToggle.addEventListener('change', function () {
    var enabled = enableToggle.checked;
    chrome.storage.sync.set({ 'enabled': enabled }, function () {
      console.log('Settings saved:', enabled );
    });
  });
});

  