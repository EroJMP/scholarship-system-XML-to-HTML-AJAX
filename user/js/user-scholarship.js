function loadScholarships() {
  const xmlRequest = new XMLHttpRequest();
  const xslRequest = new XMLHttpRequest();

  xmlRequest.open("GET", "../xml/scholarship-offer.xml", true);
  xslRequest.open("GET", "../xsl/user-scholarship-cards.xsl", true);

  xmlRequest.onreadystatechange = function () {
    if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
      xslRequest.onreadystatechange = function () {
        if (xslRequest.readyState === 4 && xslRequest.status === 200) {
          const xml = xmlRequest.responseXML;
          const xsl = xslRequest.responseXML;

          if (window.XSLTProcessor) {
            const processor = new XSLTProcessor();
            processor.importStylesheet(xsl);
            const result = processor.transformToFragment(xml, document);
            document.getElementById("scholarshipContainer").appendChild(result);
          }
        }
      };
      xslRequest.send();
    }
  };
  xmlRequest.send();
}

document.addEventListener("DOMContentLoaded", loadScholarships);

