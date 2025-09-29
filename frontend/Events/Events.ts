// button handler
function EventsPage(): void {

    // register button
    const registerButton = document.getElementById("registerBtn") as HTMLButtonElement;

    // click event
    if (registerButton) {
        registerButton.addEventListener("click", function (event: Event) {
            event.preventDefault();
            alert("Sorry, Registration is Closed");
            console.log("Someone tried to register!");
        });
    }
}

// load page
document.addEventListener('DOMContentLoaded', EventsPage);