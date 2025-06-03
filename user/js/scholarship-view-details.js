function loadScholarshipDetails(id) {
    const xml = new XMLHttpRequest();
    xml.open("GET", "../xml/scholarship-offer.xml", false);
    xml.send();
    const xmlDoc = xml.responseXML;

    const xsl = new XMLHttpRequest();
    xsl.open("GET", "../xsl/scholarship-details.xsl", false);
    xsl.send();
    const xslDoc = xsl.responseXML;

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    xsltProcessor.setParameter(null, "scholarshipId", id);

    const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
    document.getElementById("details-container").appendChild(resultDocument);
  }

  window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      loadScholarshipDetails(id);
    } else {
      document.getElementById("details-container").innerHTML = "<p>No scholarship ID provided.</p>";
    }
  };