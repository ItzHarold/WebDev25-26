"use strict";
function Modalrun() {
    const modal = document.getElementById("eventModal");
    const iframe = document.getElementById("eventFrame");
    const eventBtn = document.getElementById("eventBtn");
    const closeBtn = document.getElementById("xbtn");
    console.error('null');
    // check if types are not null?
    if (!modal || !iframe || !eventBtn || !closeBtn) {
        return;
    }
    if (eventBtn) {
        eventBtn.addEventListener("click", function (event) {
            event.preventDefault();
            const href = eventBtn.getAttribute("href");
            if (href) {
                iframe.src = href;
            }
            modal.style.display = 'flex';
        });
        closeBtn.addEventListener('click', function (event) {
            event.preventDefault();
            modal.style.display = "none";
        });
    }
}
// load page
document.addEventListener('DOMContentLoaded', Modalrun);
