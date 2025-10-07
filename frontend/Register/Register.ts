document.addEventListener('DOMContentLoaded', () => {
    const pwd = document.getElementById('password') as HTMLInputElement | null;
    const toggle = document.getElementById('toggle') as HTMLButtonElement | null;
    const refreshBtn = document.getElementById('registerRefresh') as HTMLButtonElement | null;

    if (toggle && pwd) {
        toggle.addEventListener('click', () => {
            pwd.type = pwd.type === 'password' ? 'text' : 'password';
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            location.reload();
        });
    }
});
