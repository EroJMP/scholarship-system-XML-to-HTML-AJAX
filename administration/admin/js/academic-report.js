$(document).ready(function () {
  const xmlPath = '../xml/application.xml';
  const xslPath = '../xsl/report.xsl';

  Promise.all([
    fetch(xmlPath).then(res => res.text()),
    fetch(xslPath).then(res => res.text())
  ])
    .then(([xmlText, xslText]) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");
      const xsl = parser.parseFromString(xslText, "application/xml");

      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      const resultDocument = xsltProcessor.transformToFragment(xml, document);

      const reportDiv = document.getElementById("report");
      reportDiv.innerHTML = '';
      reportDiv.appendChild(resultDocument);

      const table = $('#scholarshipTable').DataTable({
        dom: 'Brt',
        paging: false,
        ordering: true,
        searching: true
      });

      $('#customSearch').on('keyup', function () {
        table.search(this.value).draw();
      });

      $('#exportButton').on('click', function (e) {
        e.stopPropagation();
        $('#exportDropdown').toggle();
        $('#postDropdown').hide(); 
      });

      $('#postButton').on('click', function (e) {
        e.stopPropagation();
        $('#postDropdown').toggle();
        $('#exportDropdown').hide(); 
      });

      $(document).on('click', function () {
        $('#exportDropdown').hide();
        $('#postDropdown').hide();
      });

      $('#exportDropdown').on('click', '.export-option', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const selectedCategory = $(this).data('category');

        $('#exportDropdown').hide();

        const originalSearch = table.search();

        if (selectedCategory === 'all') {
          table.search('').draw();
        } else {
          table.columns().every(function () {
            const header = $(this.header()).text().trim().toLowerCase();
            if (header === "category") {
              this.search('^' + selectedCategory + '$', true, false).draw();
            }
          });
        }

        table.buttons().remove();

        table.button().add(0, {
          extend: 'csvHtml5',
          title: `Scholarship_Export_${selectedCategory.replace(/\s+/g, '_')}`,
          exportOptions: {
            columns: ':visible'
          }
        });

        table.button(0).trigger();

        setTimeout(() => {
          table.search(originalSearch).columns().search('').draw();
        }, 500);
      });

      $('#postDropdown').on('click', '.post-option', function (e) {
  e.preventDefault();
  e.stopPropagation();
  const selectedCategory = $(this).data('category');

  $('#postDropdown').hide();

  const originalSearch = table.search();

  const exportMap = {
    "Academic Scholarship": { filter: "Academic Scholarship", columns: [0,1,3,4,5] },
    "Private Scholarship": { filter: "Private Scholarship", columns: [0,1,3,4,5] },
    "Sports Scholarship": { filter: "Sports Scholarship", columns: [0,1,3,4,5] },
    "Bar and Board Assistance": { filter: "Bar and Board Assistance", columns: [0,1] },
    "Honor Incentives": { filter: "Honor Incentives", columns: [0,1,3] },
    "SK Scholarship": { filter: "SK Scholarship", columns: [0,1,3,4,5] },
    "OSL Scholarship": { filter: "OSL Scholarship", columns: [0,1,3,4,5] },
    "Chip-in Scholarship": { filter: "Chip-in Scholarship", columns: [0,1,3,4,5] },
  };

  const config = exportMap[selectedCategory];

  if (!config) {
    console.error("Unknown category selected for export:", selectedCategory);
    return;
  }

  const categoryColIndex = table.columns().indexes().filter((idx) => {
    const header = $(table.column(idx).header()).text().trim().toLowerCase();
    return header === "category";
  })[0];

  if (categoryColIndex === undefined) {
    console.error("Category column not found!");
    return;
  }

  table.column(categoryColIndex).search('^' + config.filter + '$', true, true);
  table.draw();

  table.buttons().remove();

  table.button().add(0, {
    extend: 'csvHtml5',
    title: `Post_Export_${selectedCategory.replace(/\s+/g, '_')}`,
    exportOptions: {
      columns: config.columns
    }
  });

  table.button(0).trigger();

  setTimeout(() => {
    table.search(originalSearch).columns().search('').draw();
  }, 500);
});

    })
    .catch(error => {
      console.error("Error loading or transforming XML/XSL:", error);
    });
});
