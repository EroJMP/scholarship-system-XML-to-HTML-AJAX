<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <div class="row g-4">
      <xsl:for-each select="scholarships/scholarship">
        <xsl:if test="availability = 'open'">
          <div class="col-md-4">
            <div class="card border-3 border-custom shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  <xsl:value-of select="title"/>
                </h5>
                <p class="card-text text-muted">
                  <xsl:value-of select="description"/>
                </p>
                <p class="small text-muted">
                  <i class="bi bi-calendar-event me-1"></i>
                  Deadline: <xsl:value-of select="deadline"/>
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <a href="scholarship-view-details.html?id={id}" class="text-decoration-none dark-blue-color">View Details</a>
                  <a href="../pages/academic-apply.html?id={id}" class="btn btn-custom btn-sm">Apply Now</a>
                </div>
              </div>
            </div>
          </div>
        </xsl:if>
      </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>
