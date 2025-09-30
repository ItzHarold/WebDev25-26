// <!-- loader for shared topbar -->

// load the shared topbar fragment into #topbar
(function () {
    fetch('../Shared/topbar.html')
        .then(function (r) { return r.text(); })
        .then(function (html) { document.getElementById('topbar').innerHTML = html; })
        .catch(function () {
            // fallback if fetch fails (simple structure)
            document.getElementById('topbar').innerHTML =
                '<nav class="topbar"><div class="logo"><a href="../Home/Home.html"><img src="pictures/defaulticon.jpg" alt="Logo"></a></div>'
                + '<div class="nav-links"><a href="../Home/Home.html">Home</a><a href="../Dashboard/Dashboard.html">Dashboard</a><a href="../About/About.html">About</a><a href="../Contact/Contact.html">Contact</a></div>'
                + '<div class="welcome">Welcome USER</div></nav>';
        });
})();
const modal = document.getElementById("eventModal");
const iframe = document.getElementById("eventFrame");
const eventBtn = document.getElementById("eventBtn");
const closeBtn = document.getElementById("xbtn");

eventBtn.addEventListener("click", function (event) {
    event.preventDefault();
    iframe.src = eventBtn.getAttribute("href"); // Events.html in iframe from href
    modal.style.display = "flex"; // show modal
});
closeBtn.addEventListener("click"), function (event) {
    modal.style.display = "none"; // close modal
}
