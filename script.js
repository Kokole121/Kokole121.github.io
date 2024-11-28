document.getElementById("send-button").addEventListener("click", async function() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;
  
    // Display user message
    displayMessage(userInput, "user");
  
    // Send message to backend via HTTPS
    try {
      const response = await fetch("https://YOUR_CLOUD_FUNCTION_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
      });
  
      const data = await response.json();
      displayMessage(data.response, "assistant");
    } catch (error) {
      console.error("Error:", error);
      displayMessage("Sorry, something went wrong. Please try again later.", "assistant");
    }
  
    document.getElementById("user-input").value = ""; // Clear input field
  });
  
  // Function to display messages in the chat box
  function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
  }
  

  