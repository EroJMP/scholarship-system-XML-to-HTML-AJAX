<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
  <xsl:output method="html" indent="yes"/>
  <xsl:param name="id" />

  <xsl:template match="/">
    <xsl:for-each select="announcements/announcement[id = $id]">
      <div class="card shadow-sm p-4 mb-4">
        <small class="text-muted d-block mb-2">
          <xsl:value-of select="date"/>
        </small>
        <h3 class="fw-bold"><xsl:value-of select="title"/></h3>
        <p class="text-dark fw-bold"><xsl:value-of select="subject"/></p>
        <p class="text-muted mt-3"><xsl:value-of select="content"/></p>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
