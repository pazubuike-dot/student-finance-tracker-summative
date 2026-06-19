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
const importInput = document.getElementById('action-import-json-file');

if (importInput) {
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    localStorage.setItem('finance_ledger_records', JSON.stringify(importedData));
                    window.location.reload();
                } catch (error) {
                    alert('Invalid JSON file format. Please upload a valid data profile.');
                }
            };
            reader.readAsText(file);
        }
    });
}
