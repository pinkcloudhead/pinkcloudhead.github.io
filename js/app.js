document.addEventListener('DOMContentLoaded', () => {
    const filterCountryInput = document.getElementById('filter-country');
    const filterCompanyInput = document.getElementById('filter-company');
    const resetButton = document.getElementById('reset-filters');

    // DataTable Basis
    const table = $('#emission-table').DataTable({
        paging: true,
        ordering: true,
        order: [],
        pageLength: 10,
        columnDefs: [
            { targets: 2, type: 'num' }
        ],
        language: {
            lengthMenu: "Zeige _MENU_ Einträge",
            zeroRecords: "Keine passenden Einträge gefunden",
            info: "Zeige _START_ bis _END_ von _TOTAL_ Einträgen",
            infoEmpty: "Keine Daten verfügbar",
            search: "Suche:",
            paginate: {
                first: "Erste",
                last: "Letzte",
                next: "Nächste",
                previous: "Vorherige"
            }
        }
    });

    // Eingabefelder absichern
    function sanitizeInput(input) {
        const sanitized = input.replace(/[<>"'`\/]/g, '').trim();
        if (!/^[a-zA-ZäöüÄÖÜß\s]*$/.test(sanitized)) { 
            return '';
        }
        return sanitized;
    }  

    // Filter-Funktion
    function filterTable() {
        const countryFilter = sanitizeInput(filterCountryInput.value.toLowerCase());
        const companyFilter = sanitizeInput(filterCompanyInput.value.toLowerCase());

        table.rows().every(function () {
            const row = this.data();
            const showRow =
                row[0].toLowerCase().includes(countryFilter) &&
                row[1].toLowerCase().includes(companyFilter);
            $(this.node()).toggle(showRow); 
        });
    }

    // Event-Listener für Filtereingaben mit Validierung
    filterCountryInput.addEventListener('input', () => {
        filterCountryInput.value = sanitizeInput(filterCountryInput.value);
        filterTable();
    });

    filterCompanyInput.addEventListener('input', () => {
        filterCompanyInput.value = sanitizeInput(filterCompanyInput.value);
        filterTable();
    });

    // Zurücksetzen-Button
    resetButton.addEventListener('click', () => {
        filterCountryInput.value = '';
        filterCompanyInput.value = '';
        table.search('').columns().search('').draw(false); 
        table.rows().every(function () {
            $(this.node()).show(); 
        });
        table.order([]).draw(false);
    });

    // Klick-Filter auf Länder
    $('#emission-table tbody').on('click', 'td:first-child', function () {
        const country = $(this).text().trim();
        filterCountryInput.value = sanitizeInput(country);
        filterTable();
    });
});
