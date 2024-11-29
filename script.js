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
      console.log(sessionStorage['thread_id'])
      console.log(data.message.content)
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
      console.log(data.message)
      displayMessage(data.message.content, "assistant");
  } catch (error) {
      console.error("Message Sending Error:", error);
      displayMessage("Sorry, something went wrong. Please try again later.", "assistant");
  }

  document.getElementById("user-input").value = ""; // Clear input field
}


  // Function to display messages in the chat box
  function displayMessage(message, sender) {
    console.log('creating message')
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
  }
  
  // Initialize the chat on page load
window.addEventListener("load", initializeChat);

// Add event listeners to buttons
document.getElementById("send-button").addEventListener("click", sendMessage);

  