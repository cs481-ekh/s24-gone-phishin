console.log("Starting database initialization...");
var dao;
// lists out keywords and their risks
var keywords = [
    { keyword: "invoice", riskScore: 4 },
    { keyword: "new", riskScore: 2 },
    { keyword: "message", riskScore: 3 },
    { keyword: "file", riskScore: 4 },
    { keyword: "request", riskScore: 5 },
    { keyword: "action", riskScore: 5 },
    { keyword: "verification", riskScore: 6 },
    { keyword: "efax", riskScore: 7 },
    { keyword: "voicemail", riskScore: 6 },
    { keyword: "label", riskScore: 3 },
    { keyword: "post", riskScore: 2 },
    { keyword: "document", riskScore: 5 },
    { keyword: "postal", riskScore: 4 },
    { keyword: "calculations", riskScore: 6 },
    { keyword: "copy", riskScore: 3 },
    { keyword: "fedex", riskScore: 6 },
    { keyword: "statement", riskScore: 6 },
    { keyword: "financial", riskScore: 7 },
    { keyword: "dhl", riskScore: 5 },
    { keyword: "usps", riskScore: 5 },
    { keyword: "notification", riskScore: 4 },
    { keyword: "n", riskScore: 1 },
    { keyword: "irs", riskScore: 5 },
    { keyword: "delivery", riskScore: 4 },
    { keyword: "ticket", riskScore: 3 },
    { keyword: "free", riskScore: 3 },
    { keyword: "now", riskScore: 1 },
    { keyword: "click", riskScore: 3 },
    { keyword: "urgent", riskScore: 7 },
    { keyword: "winner", riskScore: 4 },
    { keyword: "winning", riskScore: 3 },
    { keyword: "congratulations", riskScore: 3 },
    { keyword: "password", riskScore: 9 },
    { keyword: "passwords", riskScore: 9 },
    { keyword: "username", riskScore: 8 },
    { keyword: "usernames", riskScore: 8 },
    { keyword: "SSN", riskScore: 10 },
    { keyword: "inv", riskScore: 4 },
    { keyword: "required", riskScore: 3 },
    { keyword: "8", riskScore: 1 },
    { keyword: "shipment", riskScore: 4 },
    { keyword: "ups", riskScore: 4 },
    { keyword: "express", riskScore: 4 },
    { keyword: "alert", riskScore: 5 },
    { keyword: "confirmation", riskScore: 5 },
    { keyword: "report", riskScore: 3 },
    { keyword: "idnotification", riskScore: 4 },
    { keyword: "tax", riskScore: 5 },
    { keyword: "taxes", riskScore: 5 },
    { keyword: "download", riskScore: 6 },
    { keyword: "link", riskScore: 5 }
];

// initializes Hook Line Secure database
var request = indexedDB.open("HLSdb", 3);
// Inherits change event from version check. Will need version varible for later
request.onupgradeneeded = function(event) {
    var dao = event.target.result;
    
    var objStore = dao.createObjectStore("keywords", { keyPath: "keyword" });

    // Create an index on the keywords
    objStore.createIndex("keyword", "keyword", { unique: true });

    // add each keyword from array
    keywords.forEach(function(keyword) {
        objStore.add(keyword);
    });

    const eventStore = dao.createObjectStore("events", { autoIncrement: true });
    eventStore.createIndex("timestamp", "timestamp", { unique: false });

};

// Handle errors during database opening
request.onerror = function(event) {
    console.error("Database error:", event.target.error);
};

// Handle successful database opening
request.onsuccess = function(event) {
    console.log("Database initialization successful.");
    chrome.storage.local.get('keywords', function(result) {
        const keywords = result.keywords || [];
      
        // Send a message containing the keywords array to the background script
        chrome.runtime.sendMessage({ keywords: keywords });
      });

      chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (changes.enabled) {
            var enabled = changes.enabled.newValue;
            var timestamp = Date.now();

            var request = event.target.result.transaction(["events"], "readwrite")
                                .objectStore("events")
                                .add({ enabled: enabled, timestamp: timestamp });

            request.onerror = function(event) {
                console.error("Error adding event to events object store:", event.target.error);
            };
        }
    });

};

// Keeps indexedb from overlapping databases on version change
request.onblocked = function(event) {
    console.error("Database upgrade blocked. Please close any other tabs with this site open.");
};