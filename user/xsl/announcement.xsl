<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <xsl:for-each select="announcements/announcement">
      <div>
        <xsl:attribute name="class">
          <xsl:text>announcement-card border-start border-</xsl:text>
          <xsl:value-of select="color"/>
          <xsl:text> rounded shadow-sm p-3 mb-4</xsl:text>
        </xsl:attribute>

        <div class="d-flex justify-content-between">
          <span>
            <xsl:attribute name="class">
              <xsl:text>badge bg-</xsl:text>
              <xsl:choose>
                <xsl:when test="type='Deadline'">danger</xsl:when>
                <xsl:when test="type='Event'">success</xsl:when>
                <xsl:when test="type='General'">secondary</xsl:when>
                <xsl:when test="type='Important'">warning</xsl:when>
                <xsl:otherwise>dark</xsl:otherwise>
              </xsl:choose>
              <xsl:text> mb-2</xsl:text>
            </xsl:attribute>
            <xsl:value-of select="type"/>
          </span>

          <small class="text-muted">
            <i class="bi bi-calendar-event me-1"></i>
            <xsl:value-of select="date"/>
          </small>
        </div>

        <h5 class="fw-bold dark-blue-color"><xsl:value-of select="title"/></h5>
        <p class="text-muted"><xsl:value-of select="subject"/></p>
        <a>
          <xsl:attribute name="href">
            <xsl:text>../pages/readmore.html?id=</xsl:text>
            <xsl:value-of select="id"/>
          </xsl:attribute>
          <xsl:attribute name="class">btn btn-link</xsl:attribute>
          Read More
        </a>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
