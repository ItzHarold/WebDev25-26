// Initialize when the page DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadTopbar();
    setupTournamentSearch();
});

// Load topbar.html into the #topbar element. If fetch fails, use a small fallback HTML.
function loadTopbar(): void {
    const topbarElement = document.getElementById('topbar');
    if (!topbarElement) return;

    fetch('../Shared/topbar.html')
        .then(res => res.text())
        .then(html => {
            if (topbarElement) topbarElement.innerHTML = html;
        })
        .catch(() => {
            if (topbarElement) {
                topbarElement.innerHTML =
                    '<nav class="topbar"><div class="logo"><a href="../Home/Home.html"><img src="pictures/defaulticon.jpg" alt="Logo"></a></div>' +
                    '<div class="nav-links"><a href="../Home/Home.html">Home</a><a href="../Dashboard/Dashboard.html">Dashboard</a><a href="../About/About.html">About</a><a href="../Contact/Contact.html">Contact</a></div>' +
                    '<div class="welcome">Welcome ADMIN</div></nav>';
            }
        });
}

// Reads the search input and hides table rows that don't match.
function setupTournamentSearch(): void {
    const searchBox = document.getElementById('tournament-search') as HTMLInputElement | null;
    if (!searchBox) return;

    const toLowerSafe = (s: unknown): string => (s ? String(s).toLowerCase() : '');

    const applyFilter = (): void => {
        const currentBox = document.getElementById('tournament-search') as HTMLInputElement | null;
        if (!currentBox) return;

        const query = toLowerSafe(currentBox.value ? currentBox.value.trim() : '');
        const tableBody = document.querySelector('.tournaments-table tbody') as HTMLTableSectionElement | null;
        if (!tableBody) return;

        const rowElements = tableBody.getElementsByTagName('tr');
        for (let i = 0; i < rowElements.length; i++) {
            const row = rowElements[i] as HTMLTableRowElement;
            const cellElements = row.getElementsByTagName('td');

            if (!cellElements || cellElements.length === 0) {
                row.style.display = '';
                continue;
            }

            const name = toLowerSafe(cellElements[0].textContent);
            const gameName = toLowerSafe(cellElements[1]?.textContent);
            const statusText = toLowerSafe(cellElements[2]?.textContent);

            const combined = `${name} ${gameName} ${statusText}`;
            row.style.display = (query === '' || combined.includes(query)) ? 'table-row' : 'none';
        }
    };

    searchBox.addEventListener('input', applyFilter);
    applyFilter();
}
