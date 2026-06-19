const transactionForm = document.getElementById('financial-input-form');
const importInput = document.getElementById('action-import-json-file');
const ledgerTableBody = document.getElementById('ledger-table-rows');
const totalCountElement = document.getElementById('metric-total-count');
const totalSumElement = document.getElementById('metric-total-sum');
const topTagElement = document.getElementById('metric-top-tag');
const alertBox = document.getElementById('budgetary-live-alert');
const thresholdInput = document.getElementById('field-budget-threshold');

function getRecords() {
    return JSON.parse(localStorage.getItem('finance_ledger_records')) || [];
}

function renderApp() {
    const records = getRecords();
    if (!ledgerTableBody) return;
    
    ledgerTableBody.innerHTML = '';
    let totalSum = 0;
    const categoriesMap = {};

    records.forEach((record, index) => {
        totalSum += record.amount;
        categoriesMap[record.category] = (categoriesMap[record.category] || 0) + record.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.description}</td>
            <td>$${record.amount.toFixed(2)}</td>
            <td>${record.category}</td>
            <td><button class="remove-btn" data-index="${index}" style="background:#2563eb;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;">Remove</button></td>
        `;
        ledgerTableBody.appendChild(row);
    });

    if (totalCountElement) totalCountElement.textContent = records.length;
    if (totalSumElement) totalSumElement.textContent = totalSum.toFixed(2);

    let topCategory = 'N/A';
    let maxSpending = 0;
    for (const cat in categoriesMap) {
        if (categoriesMap[cat] > maxSpending) {
            maxSpending = categoriesMap[cat];
            topCategory = cat;
        }
    }
    if (topTagElement) topTagElement.textContent = topCategory;

    const limit = parseFloat(thresholdInput?.value) || 1000;
    if (alertBox) {
        if (totalSum > limit) {
            alertBox.textContent = `Alert: Expenses ($${totalSum.toFixed(2)}) exceed cap of $${limit.toFixed(2)}!`;
            alertBox.style.background = '#dc2626';
            alertBox.style.color = '#fff';
            alertBox.style.padding = '12px';
            alertBox.style.borderRadius = '4px';
            alertBox.style.marginTop = '10px';
        } else if (totalSum > limit * 0.8) {
            const rem = limit - totalSum;
            alertBox.textContent = `Warning: Approaching spending cap ceiling. Remaining balance: $${rem.toFixed(2)}`;
            alertBox.style.background = '#ea580c';
            alertBox.style.color = '#fff';
            alertBox.style.padding = '12px';
            alertBox.style.borderRadius = '4px';
            alertBox.style.marginTop = '10px';
        } else {
            alertBox.textContent = '';
            alertBox.style.padding = '0';
        }
    }

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            const current = getRecords();
            current.splice(idx, 1);
            localStorage.setItem('finance_ledger_records', JSON.stringify(current));
            renderApp();
        });
    });
}

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
        const existingRecords = getRecords();
        existingRecords.push(newEntry);

        localStorage.setItem('finance_ledger_records', JSON.stringify(existingRecords));
        transactionForm.reset();
        renderApp();
    });
}

if (importInput) {
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    localStorage.setItem('finance_ledger_records', JSON.stringify(importedData));
                    renderApp();
                } catch (error) {
                    alert('Invalid JSON file format. Please upload a valid data profile.');
                }
            };
            reader.readAsText(file);
        }
    });
}

if (thresholdInput) {
    thresholdInput.addEventListener('input', renderApp);
}

document.addEventListener('DOMContentLoaded', renderApp);