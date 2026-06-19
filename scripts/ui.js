import * as state from './state.js';
import { validateField, compileRegex } from './validators.js';
import { highlight } from './search.js';
import { save } from './storage.js';

let currentSortField = 'date';
let sortAscending = false;
let activeSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initializeDataStore();
    setupEventListeners();
    renderApp();
});

async function initializeDataStore() {
    const existing = state.getRecords();
    if (existing.length === 0) {
        try {
            const response = await fetch('./seed.json');
            const initialData = await response.json();
            initialData.forEach(item => state.addRecord(item));
            renderApp();
        } catch (e) {
            console.error("Could not seed data store template", e);
        }
    }
}

function setupEventListeners() {
    const form = document.getElementById('financial-input-form');
    form.addEventListener('submit', handleFormSubmit);

    ['field-description', 'field-amount', 'field-date', 'field-category'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => {
            const name = input.getAttribute('name');
            const errorSpan = document.getElementById(`err-feedback-${name}`);
            const errorMsg = validateField(name, input.value);
            errorSpan.textContent = errorMsg || '';
        });
    });

    const searchInput = document.getElementById('search-regex-field');
    searchInput.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value;
        renderTable();
    });

    document.getElementById('trigger-sort-date').addEventListener('click', () => toggleSort('date'));
    document.getElementById('trigger-sort-desc').addEventListener('click', () => toggleSort('description'));
    document.getElementById('trigger-sort-amount').addEventListener('click', () => toggleSort('amount'));

    document.getElementById('field-budget-threshold').addEventListener('input', renderDashboard);

    document.getElementById('action-export-json').addEventListener('click', handleDataExport);
    document.getElementById('action-import-json-file').addEventListener('change', handleDataImport);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    const fields = {
        description: document.getElementById('field-description').value,
        amount: document.getElementById('field-amount').value,
        date: document.getElementById('field-date').value,
        category: document.getElementById('field-category').value
    };

    let hasErrors = false;
    Object.keys(fields).forEach(name => {
        const errorMsg = validateField(name, fields[name]);
        const errorSpan = document.getElementById(`err-feedback-${name}`);
        if (errorMsg) {
            errorSpan.textContent = errorMsg;
            hasErrors = true;
        } else {
            errorSpan.textContent = '';
        }
    });

    if (hasErrors) return;

    state.addRecord(fields);
    form.reset();
    renderApp();
}

function toggleSort(field) {
    if (currentSortField === field) {
        sortAscending = !sortAscending;
    } else {
        currentSortField = field;
        sortAscending = true;
    }
    renderTable();
}

function renderApp() {
    renderDashboard();
    renderTable();
}

function renderDashboard() {
    const records = state.getRecords();
    const totalCount = records.length;
    const totalSum = records.reduce((sum, item) => sum + item.amount, 0);

    document.getElementById('metric-total-count').textContent = totalCount;
    document.getElementById('metric-total-sum').textContent = totalSum.toFixed(2);

    const categories = records.map(r => r.category);
    if (categories.length > 0) {
        const counts = categories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        const topCat = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        document.getElementById('metric-top-tag').textContent = topCat;
    } else {
        document.getElementById('metric-top-tag').textContent = 'N/A';
    }

    const thresholdInput = document.getElementById('field-budget-threshold');
    const threshold = parseFloat(thresholdInput.value) || 0;
    const alertBox = document.getElementById('budgetary-live-alert');

    if (totalSum > threshold) {
        alertBox.textContent = `Alert: Expenses ($${totalSum.toFixed(2)}) exceed cap of $${threshold.toFixed(2)}!`;
        alertBox.style.backgroundColor = 'var(--color-system-error)';
        alertBox.style.color = 'var(--color-surface)';
    } else if (totalSum >= threshold * 0.85) {
        alertBox.textContent = `Warning: Approaching spending cap ceiling. Remaining balance: $${(threshold - totalSum).toFixed(2)}`;
        alertBox.style.backgroundColor = 'var(--color-system-warning)';
        alertBox.style.color = 'var(--color-primary-base)';
    } else {
        alertBox.textContent = `Status secure. Budget allocation normal. Balance available: $${(threshold - totalSum).toFixed(2)}`;
        alertBox.style.backgroundColor = 'var(--color-system-success)';
        alertBox.style.color = 'var(--color-surface)';
    }
}

function renderTable() {
    const tbody = document.getElementById('ledger-table-rows');
    tbody.innerHTML = '';

    let items = state.sortRecords(currentSortField, sortAscending);

    if (activeSearchQuery.trim()) {
        const regex = compileRegex(activeSearchQuery.trim());
        if (regex) {
            items = items.filter(item => 
                regex.test(item.description) || 
                regex.test(item.category)
            );
        }
    }

    const regexInstance = compileRegex(activeSearchQuery.trim());

    items.forEach(item => {
        const tr = document.createElement('tr');
        
        const displayDesc = highlight(item.description, regexInstance);
        const displayCat = highlight(item.category, regexInstance);

        tr.innerHTML = `
            <td data-label="Date">${item.date}</td>
            <td data-label="Description">${displayDesc}</td>
            <td data-label="Amount">$${item.amount.toFixed(2)}</td>
            <td data-label="Category">${displayCat}</td>
            <td data-label="Operations">
                <button class="delete-action-btn" data-id="${item.id}" aria-label="Delete entry row matching description ${item.description}">Remove</button>
            </td>
        `;

        tr.querySelector('.delete-action-btn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            state.deleteRecord(id);
            renderApp();
        });

        tbody.appendChild(tr);
    });
}

function handleDataExport() {
    const records = state.getRecords();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "finance_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function handleDataImport(e) {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = function(event) {
        try {
            const parsedData = JSON.parse(event.target.result);
            if (!Array.isArray(parsedData)) throw new Error();
            
            const isValid = parsedData.every(item => 
                item.description && 
                item.amount !== undefined && 
                item.date && 
                item.category
            );

            if (!isValid) throw new Error();

            save(parsedData);
            window.location.reload();
        } catch {
            alert("Configuration configuration matching data arrays failed file integrity checks.");
        }
    };
    fileReader.readAsText(file);
}
