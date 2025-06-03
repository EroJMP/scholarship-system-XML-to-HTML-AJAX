function loadAnnouncements() {
  const xmlFile = '../xml/announcement.xml';
  const xslFile = '../xsl/announcement.xsl';

  Promise.all([
    fetch(xmlFile).then(res => res.text()),
    fetch(xslFile).then(res => res.text())
  ]).then(([xmlText, xslText]) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const xsl = parser.parseFromString(xslText, 'text/xml');

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    
    const result = xsltProcessor.transformToFragment(xml, document);
    document.getElementById('announcement-container').appendChild(result);
  }).catch(err => console.error('Error loading announcements:', err));
}

window.onload = loadAnnouncements;