document.addEventListener('DOMContentLoaded', () => {
    const filterCountryInput = document.getElementById('filter-country');
    const filterCompanyInput = document.getElementById('filter-company');
    const resetButton = document.getElementById('reset-filters');

    // Unerlaubte URL Parameter entfernen
    window.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        for (const [key, value] of params.entries()) {
            if (!/^[a-zA-Z0-9-_]*$/.test(value)) {
                console.warn(`Unerlaubter URL-Parameter entdeckt: ${key}=${value}`);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }); 

    // DataTable Basis
    const table = $('#emission-table').DataTable({
        paging: true,
        ordering: true,
        order: [],
        pageLength: 10,
        columnDefs: [
            {
                targets: 0, // Land
                render: DataTable.render.text()
            },
            {
                targets: 1, // Unternehmen
                render: DataTable.render.text()
            },
            { 
                targets: 2, // Emissionen
                type: 'num' 
            }
        ],
        language: {
            lengthMenu: "Zeige _MENU_ Einträge",
            zeroRecords: "Keine passenden Einträge gefunden",
            info: "Zeige _START_ bis _END_ von _TOTAL_ Einträgen",
            infoEmpty: "Keine Daten verfügbar",
            infoFiltered: "(gefiltert aus _MAX_ Einträgen)",
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
        return input.replace(/[<>!?=^%',]/g, '');
    }

    // Sucheingabe validieren
    const searchInput = $('#emission-table_filter input');
    searchInput.on('input', function () {
        const sanitizedValue = sanitizeInput($(this).val());
        $(this).val(sanitizedValue);
        table.search(sanitizedValue).draw();
    });

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
    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        filterCountryInput.value = '';
        filterCompanyInput.value = '';
        table.search('').columns().search('').draw(false); 
        table.rows().every(function () {
            $(this.node()).show(); 
        });
        table.order([]).draw(false);
    });
    
    // Touch-Unterstützung für Mobile
    $('#reset-filters').on('touchstart click', function () {
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
