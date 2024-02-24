// popup.js
document.addEventListener("DOMContentLoaded", function() {
    const getDataButton = document.getElementById("getDataButton");
  
    getDataButton.addEventListener("click", function() {
      chrome.runtime.sendMessage({ action: "getData" }, function(response) {
        if (response.success) {
          console.log("Data from API:", response.data);
          // Do something with the data, e.g., display it in the popup
          // Note: This is just a basic example. You might want to update the UI more gracefully.
          const matchesArray = response.data.matches;
          const matchesCount = matchesArray ? matchesArray.length : 0;
          document.body.innerHTML = `<pre>${JSON.stringify(matchesCount - 1, null, 2)}</pre>`;
        } else {
          console.error("Failed to get data:", response.error);
          // Handle error, e.g., display error message in the popup
          document.body.innerHTML = `<p>Error: ${response.error}</p>`;
        }
      });
    });
  });
  