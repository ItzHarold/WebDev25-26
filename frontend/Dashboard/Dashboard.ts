// Initialize when the page DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderTournaments();
    setupTournamentSearch();
});

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

// --- Tournament rendering moved to TypeScript ---
type Tournament = {
    name: string;
    game: string;
    status: string;
    teams: string;
    startDate: string; // kept as display string for now
};

const tournaments: Tournament[] = [
    { name: 'CS2 Global Championship 2025', game: 'Counter-Strike 2', status: 'Registration Open', teams: '1/32', startDate: '3/15/2025' },
    { name: 'VALORANT Champions Tour', game: 'VALORANT', status: 'Completed', teams: '32/32', startDate: '4/01/2025' },
    { name: 'Arena Clash - Spring Cup', game: 'Arena FPS', status: 'Ongoing', teams: '8/64', startDate: '9/05/2025' },
    { name: 'Rocket Rumble Invitational', game: 'Rocket League', status: 'Registration Open', teams: '3/16', startDate: '10/12/2025' },
    { name: 'Super Smash Showdown', game: 'Super Smash Bros', status: 'Completed', teams: '16/16', startDate: '2/20/2025' },
    { name: 'Indie Cup: Open Qualifiers', game: 'Various', status: 'Cancelled', teams: '0/64', startDate: '5/01/2025' },
    { name: 'LAN Heroes - Autumn League', game: 'Multiple', status: 'Registration Open', teams: '12/24', startDate: '11/18/2025' }
];

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function statusClass(status: string): string {
    const key = status.toLowerCase();
    if (key.includes('completed')) return 'status-pill status-completed';
    if (key.includes('registration')) return 'status-pill';
    if (key.includes('ongoing')) return 'status-pill';
    if (key.includes('cancel')) return 'status-pill';
    return 'status-pill';
}

function renderTournaments(): void {
    const tableBody = document.querySelector('.tournaments-table tbody') as HTMLTableSectionElement | null;
    if (!tableBody) return;

    // Clear any existing rows
    tableBody.innerHTML = '';

    for (const t of tournaments) {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = t.name;

        const gameTd = document.createElement('td');
        gameTd.textContent = t.game;

        const statusTd = document.createElement('td');
        const span = document.createElement('span');
        span.className = statusClass(t.status);
        span.textContent = t.status;
        statusTd.appendChild(span);

        const teamsTd = document.createElement('td');
        teamsTd.textContent = t.teams;

        const dateTd = document.createElement('td');
        dateTd.textContent = t.startDate;

        const actionsTd = document.createElement('td');
        actionsTd.textContent = 'View · Edit · Delete';

        tr.appendChild(nameTd);
        tr.appendChild(gameTd);
        tr.appendChild(statusTd);
        tr.appendChild(teamsTd);
        tr.appendChild(dateTd);
        tr.appendChild(actionsTd);

        tableBody.appendChild(tr);
    }
}
