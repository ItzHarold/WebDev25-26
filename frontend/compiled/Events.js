"use strict";
// Super simple version - just the button handler
function EventsPage() {
    // Find the register button
    const registerButton = document.getElementById("registerBtn");
    // Add click event
    if (registerButton) {
        registerButton.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Sorry, Registration is Closed");
            console.log("Someone tried to register!");
        });
    }
}
// Wait for page to load
document.addEventListener('DOMContentLoaded', EventsPage);
