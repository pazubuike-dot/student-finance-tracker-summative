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
const transactionForm = document.getElementById('financial-input-form');

if (transactionForm) {
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const description = document.getElementById('field-description').value.trim();
        const amount = parseFloat(document.getElementById('field-amount').value.trim());
        const date = document.getElementById('field-date').value;
        const category = document.getElementById('field-category').value.trim();

        if (!description || isNaN(amount) || !date || !category) {
            alert('Please fill out all fields with valid information.');
            return;
        }

        const newEntry = { description, amount, date, category };

        const existingRecords = JSON.parse(localStorage.getItem('finance_ledger_records')) || [];
        existingRecords.push(newEntry);

        localStorage.setItem('finance_ledger_records', JSON.stringify(existingRecords));

        transactionForm.reset();
        window.location.reload();
    });
}