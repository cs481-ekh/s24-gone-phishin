// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === "getData") {
//       fetch("https://api.languagetoolplus.com/v2/check", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 "Accept": "application/json"
//             },
//             body: "text=Helo%20world&language=en-US&enabledOnly=false"
//         })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log("API Response:", data);
//           sendResponse({ success: true, data });
//         })
//         .catch(error => {
//           console.error("Error fetching data:", error);
//           sendResponse({ success: false, error: error.message });
//         });
//       // Return true to indicate that sendResponse will be called asynchronously
//       return true;
//     }
//   });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "getData") {
    fetch("https://api.languagetoolplus.com/v2/check", {
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Accept": "application/json"
          },
          body: "text=tet%20test%20test&language=en-US&enabledOnly=false"
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
        sendResponse({ success: true, data }); // Sending only the matches array
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        sendResponse({ success: false, error: error.message });
      });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});


