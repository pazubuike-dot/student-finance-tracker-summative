import { load, save } from './storage.js';

let records = load();

export function getRecords() {
    return records;
}

export function addRecord(data) {
    const newRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date,
        category: data.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    records.push(newRecord);
    save(records);
    return newRecord;
}

export function deleteRecord(id) {
    records = records.filter(record => record.id !== id);
    save(records);
}

export function updateRecord(id, updatedData) {
    records = records.map(record => {
        if (record.id === id) {
            return {
                ...record,
                ...updatedData,
                amount: updatedData.amount ? parseFloat(updatedData.amount) : record.amount,
                updatedAt: new Date().toISOString()
            };
        }
        return record;
    });
    save(records);
}

export function sortRecords(field, ascending = true) {
    return [...records].sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'amount') {
            return ascending ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });
}

export function searchRecords(query) {
    if (!query) return records;

    try {
        const regex = new RegExp(query, 'i');
        return records.filter(record => 
            regex.test(record.description) || 
            regex.test(record.category) ||
            regex.test(record.date)
        );
    } catch (e) {
        return [];
    }
}