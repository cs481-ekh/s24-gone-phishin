console.log("Starting database initialization...");
var dao;
// lists out keywords and their risks
var keywords = [
    { keyword: "invoice", description: "Phishing emails often impersonate legitimate companies or institutions, pretending to send invoices to trick recipients into clicking on malicious links or attachments.", riskScore: 4 },
    { keyword: "new", description: "Phishers may use 'new' as a way to make readers feel as though whatever is being offered is something fresh or important, leading them to make too quick of a decision. However, context is important with this word, as it may be appropriate.", riskScore: 2 },
    { keyword: "message", description: "Phishing emails may use this word to make the recipients feel as though possibly someone is trying to send them something important, encouraging them to interact with anything the email contains.", riskScore: 3 },
    { keyword: "file", description: "Phishers often use files as a way to deliver malware as an attempt to infect a user's system or steal sensitive information. If you are not expecting such a file or if you do not know the sender, it is generally advised that you report such emails.", riskScore: 4 },
    { keyword: "request", description: "Similar to action. Phishing emails often use this word to encourage recipients to act on something like clicking a link or responding.", riskScore: 5 },
    { keyword: "action", description: "Similar to request. Phishing emails often use this word to encourage recipients to act on something like clicking a link or responding.", riskScore: 5 },
    { keyword: "verification", description: "Things that are used to verify who you are, like passwords or SSNs, are often too sensitive to be sent over email. If an email is asking for some form of verification, it could be indicative of a phishing attempt.", riskScore: 6 },
    { keyword: "efax", description: "Phishers may impersonate eFax services to trick recipients into clicking on links or downloading attachments, potentially leading to malware infection or access to sensitive information.", riskScore: 7 },
    { keyword: "voicemail", description: "Phishing emails may claim to contain voicemail notifications, enticing recipients to click on links or download attachments, which could contain malware.", riskScore: 6 },
    { keyword: "label", description: "Phishers may use this term to imply that there's something important or official enclosed, leading recipients to click on malicious links, download harmful attachments or simply attempt to make the recipient believe in its authenticity.", riskScore: 3 },
    { keyword: "post", description: "Phishing emails may contain this word to imply the existence of something important or official in an attempt to gain trust. Similar to Postal.", riskScore: 2 },
    { keyword: "document", description: "There are two potential reasons why a phishing email may bring up documents. One way is if they are sending you an attachment in the guise of a document that may be a harmful attachment. The other way is to get document from the recipient that holds sensitive information.", riskScore: 5 },
    { keyword: "postal", description: "Phishing emails may contain this word to imply the existence of something important or official in an attempt to gain trust. Similar to Post.", riskScore: 4 },
    { keyword: "calculations", description: "Phishers may use this term to suggest financial or important documents, encouraging recipients to click on links or download attachments that could contain malware or steal sensitive information.", riskScore: 6 },
    { keyword: "copy", description: "Phishers may use this term to imply that there's a copy of an important document or communication enclosed or they are requesting a copy of a document containing sensitive information. Context is important to consider when concerning access to copies.", riskScore: 3 },
    { keyword: "fedex", description: "It is very common for phishers to impersonate FedEx to gain information on people's addresses or to steal financial information. Zip codes are especially a useful thing to know for scammers to know as they are typically associated with debit or credit cards.", riskScore: 6 },
    { keyword: "statement", description: "Phishers may attempt to use this word to imply the presence or need of important financial statements or communications. If you are not expecting to receive or send any of these sorts of documents, there is a high chance that it may be an attempt to learn financial information about you or your place of work.", riskScore: 6 },
    { keyword: "financial", description: "Financial information is typically information that you should keep private. Do not send financial information or documents over email without prior authorization if it pertains to your place of work.", riskScore: 7 },
    { keyword: "dhl", description: "Phishers may attempt to use a false tracking number to incite the recipient to act according to how the phisher wants them to. If you are expecting a package, always refer to the official shipping company you are expecting the package from.", riskScore: 5 },
    { keyword: "usps", description: "It is very common for phishers to impersonate USPS to gain information on people's addresses or to steal financial information. Zip codes are especially a useful thing to know for scammers to know as they are typically associated with debit or credit cards.", riskScore: 5 },
    { keyword: "notification", description: "Phishing emails may claim to contain important notifications or alerts, enticing recipients to click on links or download attachments that could contain malware.", riskScore: 4 },
    { keyword: "n", description: "It may be a spelling error or possibly a fingerprint. It could also represent an amount of something.", riskScore: 1 },
    { keyword: "irs", description: "It is common for Phishers to impersonate the IRS to gain sensitive financial information about the recipient or their place of work. Since taxes can be a stressful thing for individuals it may incite recipients to act swiftly without verifying the authenticity of the email. Always refer to the official IRS site or an IRS worker for tax information.", riskScore: 5 },
    { keyword: "delivery", description: "Many people order packages for delivery and many phishers use the false pretenses of some package needing an address to be sent or some other complication. Always refer to the official shipping company you ordered your delivery from.", riskScore: 4 },
    { keyword: "ticket", description: "Phishing emails might claim to contain tickets or confirmations for events or flights, enticing recipients to click on malicious links or download attachments. The recipient may also feel compelled to enter information inside these links without verifying the site's authenticity. Flight complications can be stressful but always refer to the official flight company your flight is being handled through.", riskScore: 3 },
    { keyword: "free", description: "Phishers will use the idea of free stuff to entice the recipients of their emails to interact with the email.", riskScore: 3 },
    { keyword: "now", description: "While now can be used in many normal conversations, a phisher may use it to make the recipient feel a sense of urgency.", riskScore: 1 },
    { keyword: "click", description: "Phishers may use this word to encourage interaction with the email.", riskScore: 3 },
    { keyword: "urgent", description: "Phishers use this word to imply a strong sense of urgency for some sort of response from the recipient. This urgency may make recipients feel compelled to respond without considering the authenticity of the email.", riskScore: 7 },
    { keyword: "winner", description: "Phishers will use this word to justify giving the recipient free money or stuff. The hope of the phisher is that this causes the recipient to engage with the email, in order to have them share sensitive information.", riskScore: 4 },
    { keyword: "winning", description: "Phishers will use this word to justify giving the recipient free money or stuff. The hope of the phisher is that this causes the recipient to engage with the email, in order to have them share sensitive information.", riskScore: 3 },
    { keyword: "congratulations", description: "Often paired with winning, won, or win. Phishers will use this word to justify giving the recipient free money or stuff. The hope of the phisher is that this causes the recipient to engage with the email, in order to have them share sensitive information.", riskScore: 3 },
    { keyword: "password", description: "You should never share your password with anyone. Any individual posing as someone who may require the password, like I.T, does not require your password to help you. If you are working in an office environment and someone asks to work under your account, advise them to recover their account information and that you will not share yours.", riskScore: 9 },
    { keyword: "passwords", description: "You should never share your password with anyone. Any individual posing as someone who may require the password, like I.T, does not require your password to help you. If you are working in an office environment and someone asks to work under your account, advise them to recover their account information and that you will not share yours.", riskScore: 9 },
    { keyword: "username", description: "Often times you do not need to share your username with others. In a case where you may have to, like password recovery, it is advised that you ensure the authenticity of the site or individual you are sharing the username with.", riskScore: 8 },
    { keyword: "usernames", description: "Often times you do not need to share your username with others. In a case where you may have to, like password recovery, it is advised that you ensure the authenticity of the site or individual you are sharing the username with.", riskScore: 8 },
    { keyword: "SSN", description: "Never share your social security number with anyone over email.", riskScore: 10 },
    { keyword: "inv", description: "Short for invoice. Phishing emails often impersonate legitimate companies or institutions, pretending to send invoices to trick recipients into clicking on malicious links or attachments.", riskScore: 4 },
    { keyword: "required", description: "Phishers may use this term to imply that action is necessary, encouraging recipients to click on links or download attachments that could lead to compromise or data theft.", riskScore: 3 },
    { keyword: "8", description: "It may be a spelling error or possibly a fingerprint. This has been reported to be commonly found on phishing emails.", riskScore: 1 },
    { keyword: "shipment", description: "Many people order packages for delivery and many phishers use the false pretenses of some package needing an address to be sent or some other complication. Always refer to the official shipping company you ordered your delivery from.", riskScore: 4 },
    { keyword: "ups", description: "Phishers may impersonate shipping companies like UPS, claiming to contain package tracking information or delivery updates, enticing recipients to share their address or other personal information.", riskScore: 4 },
    { keyword: "express", description: "Implies the existence of some item that is ready to be shipped and in a convenient manner. It is advised that you verify the authenticity of the email before acting as the email requests.", riskScore: 4 },
    { keyword: "alert", description: "Phishing emails may claim to contain important alerts or confirmations, encouraging recipients to click on links or download attachments that could contain malware.", riskScore: 5 },
    { keyword: "confirmation", description: "Phishing emails may claim to contain important alerts or confirmations, encouraging recipients to click on links or download attachments that could contain malware.", riskScore: 5 },
    { keyword: "report", description: "Phishing emails may claim to contain important reports or documents, enticing recipients to click on links or download attachments that could contain malware or steal sensitive information.", riskScore: 3 },
    { keyword: "idnotification", description: "Phishers may use this term to imply that there's important identity notification enclosed, leading recipients to click on malicious links or download harmful attachments.", riskScore: 4 },
    { keyword: "tax", description: "Phishers may impersonate tax authorities, claiming to contain important tax documents or communications, leading recipients to click on malicious links or download attachments.", riskScore: 5 },
    { keyword: "taxes", description: "Phishers may impersonate tax authorities, claiming to contain important tax documents or communications, leading recipients to click on malicious links or download attachments.", riskScore: 5 },
    { keyword: "download", description: "Phishing emails often instruct recipients to download attachments or click on links, potentially leading to malware infections or data theft.", riskScore: 6 },
    { keyword: "link", description: "Phishing emails often instruct recipients to download attachments or click on links, potentially leading to malware infections or data theft.", riskScore: 5 }
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