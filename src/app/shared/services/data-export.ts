import { Service } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Service()
export class DataExport {

    // Export current grid view to CSV client-side[cite: 1]
    exportToCSV(data: any[], columns: { key: string, label: string }[], filename: string = 'export.csv') {
        if (!data || !data.length) return;

        const headers = columns.map(col => col.label).join(',');
        const rows = data.map(row =>
            columns.map(col => {
                let cell = row[col.key] === null || row[col.key] === undefined ? '' : row[col.key];
                cell = cell.toString().replace(/"/g, '""'); // Escape quotes
                return `"${cell}"`;
            }).join(',')
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        this.downloadFile(blob, filename);
    }

    // Export current grid view to PDF client-side[cite: 1]
    exportToPDF(data: any[], columns: { key: string, label: string }[], filename: string = 'export.pdf') {
        if (!data || !data.length) return;

        const doc = new jsPDF();
        const headers = columns.map(col => col.label);
        const rows = data.map(row => columns.map(col => row[col.key] || ''));

        autoTable(doc, {
            head: [headers],
            body: rows,
            theme: 'striped'
        });

        doc.save(filename);
    }

    private downloadFile(blob: Blob, filename: string) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}