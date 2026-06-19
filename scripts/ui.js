const navLinks = document.querySelectorAll('.nav-tab-trigger');
const viewPanels = document.querySelectorAll('.app-view-panel');

function switchPlatformTab(targetId) {
    viewPanels.forEach(panel => {
        if (panel.id === targetId) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const hashTarget = link.getAttribute('href').substring(1);
        switchPlatformTab(hashTarget);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    switchPlatformTab('about-platform-section');
});
