function loadAnnouncementDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
      document.getElementById("announcement-detail-container").innerText = "No ID found in URL.";
      return;
    }

    const xml = new XMLHttpRequest();
    const xsl = new XMLHttpRequest();

    xml.open("GET", "../xml/announcement.xml", true);
    xsl.open("GET", "../xsl/readmore.xsl", true);

    xml.onreadystatechange = function () {
      if (xml.readyState === 4 && xml.status === 200 && xsl.readyState === 4 && xsl.status === 200) {
        const xmlDoc = xml.responseXML;
        const xslDoc = xsl.responseXML;

        const processor = new XSLTProcessor();
        processor.importStylesheet(xslDoc);
        processor.setParameter(null, "id", id);

        const result = processor.transformToFragment(xmlDoc, document);
        document.getElementById("announcement-detail-container").appendChild(result);
      }
    };

    xsl.onreadystatechange = xml.onreadystatechange;

    xml.send();
    xsl.send();
  }

  window.onload = loadAnnouncementDetails;