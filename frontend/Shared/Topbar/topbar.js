// Load topbar.html into an element with id="topbar" when the script is included on a page.
// Usage: add <div id="topbar"></div> and include this file with a path relative to the page,
// e.g. <script src="../Shared/topbar.js" defer></script>

document.addEventListener('DOMContentLoaded', () => {
  const topbarElement = document.getElementById('topbar');
  if (!topbarElement) return;

  // Default relative path used by pages in subfolders like Dashboard/: ../Shared/Topbar/topbar.html
  // Include this script with a path that makes this relative URL correct for the page.
  fetch('../Shared/Topbar/topbar.html')
    .then(res => res.text())
    .then(html => {
      topbarElement.innerHTML = html;
    })
    .catch(() => {
      // Small safe fallback if fetch fails
      topbarElement.innerHTML =
        '<nav class="topbar">' +
          '<div class="topbar-inner">' +
            '<div class="logo"><a href="../Home/Home.html"><img src="../Pictures/defaulticon.jpg" alt="Logo"></a></div>' +
            '<div class="nav-links"><a href="../Home/Home.html">Home</a><a href="../Dashboard/Dashboard.html">Dashboard</a><a href="../About/About.html">About</a><a href="../Contact/Contact.html">Contact</a></div>' +
            '<div class="welcome">Welcome USER</div>' +
          '</div>' +
        '</nav>';
    });
});
