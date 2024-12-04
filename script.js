// Function to initialize the chat
async function initializeChat() {
  try {
      const response = await fetch("https://us-central1-startupcloudvision.cloudfunctions.net/handle_request/newThread", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      });

      const data = await response.json();
      sessionStorage.setItem("thread_id", data.thread_id); // Store thread_id for later use
      console.log(data);
      console.log(sessionStorage['thread_id']);
      console.log(data.message.content);
      displayMessage(data.message.content, "assistant");
  } catch (error) {
      console.error("Initialization Error:", error);
      displayMessage("Sorry, something went wrong during initialization.", "assistant");
  }
}

// Function to send user input
async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() === "") return;

  // Display user message
  console.log("before creating messages");
  displayMessage(userInput, "user");

  console.log("started to send Message");

  // Send message to backend
  try {
      const threadId = sessionStorage.getItem("thread_id");
      console.log(threadId)
      console.log(userInput)
      const response = await fetch("https://us-central1-startupcloudvision.cloudfunctions.net/handle_request/newMessage", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              thread_id: threadId,
              message: userInput
          })
      });

      const data = await response.json();
      console.log(data);
      console.log(data.message);
      console.log(typeof(data.message));
      displayMessage(data.message, "assistant");
  } catch (error) {
      console.error("Message Sending Error:", error);
      displayMessage("Sorry, something went wrong. Please try again later.", "assistant");
  }

  document.getElementById("user-input").value = ""; // Clear input field
}


  // Function to display messages in the chat box
  function displayMessage(message, sender) {
    console.log('creating message');
    
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
  
    // Check for Markdown-style link and convert to HTML
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/; // Matches [text](url)
    const match = message.match(markdownLinkRegex);
  
    if (match) {
      const linkText = match[1];
      const linkUrl = match[2];
  
      // Create link element
      const linkElement = document.createElement("a");
      linkElement.href = linkUrl;
      linkElement.textContent = linkText;
      linkElement.target = "_blank"; // Open link in a new tab
      linkElement.rel = "noopener noreferrer"; // Security best practice
  
      messageElement.textContent = message.replace(markdownLinkRegex, ""); // Remove link placeholder
      
      // Remove the Markdown link and replace `\n` with <br>
      const textBeforeLink = message.replace(markdownLinkRegex, "").replace(/\n/g, "<br>");
      messageElement.innerHTML = textBeforeLink;


      // Add a line break
        messageElement.appendChild(document.createElement("br"));

      messageElement.appendChild(linkElement);
    } else {
      // No link detected, just set the text content
      messageElement.innerHTML = message.replace(/\n/g, "<br>");
    }
  
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
  }
  
  // Initialize the chat on page load
window.addEventListener("load", initializeChat);

// Add event listeners to buttons
document.getElementById("send-button").addEventListener("click", sendMessage);

  