"use strict";
// button handler
function EventsPage() {
    // register button
    const registerButton = document.getElementById("registerBtn");
    // click event
    if (registerButton) {
        registerButton.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Sorry, Registration is Closed");
            console.log("Someone tried to register!");
        });
    }
}
// load page
document.addEventListener('DOMContentLoaded', EventsPage);
