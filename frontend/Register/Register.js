"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const pwd = document.getElementById('password');
    const toggle = document.getElementById('toggle');
    const refreshBtn = document.getElementById('registerRefresh');
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
