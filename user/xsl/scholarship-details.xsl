<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:param name="scholarshipId" />
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <xsl:for-each select="scholarships/scholarship[id=$scholarshipId]">
      <section class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="fw-bold font-color-title mb-0">
            <xsl:value-of select="title"/>
          </h2>
          <a href="scholarship.html" class="btn btn-outline-custom">
            <i class="bi bi-arrow-left"></i> Back to Scholarships
          </a>
        </div>

        <p class="text-muted mb-1">
          <i class="bi bi-calendar-event me-2"></i>Deadline:
          <xsl:text> </xsl:text>
          <xsl:value-of select="deadline"/>
        </p>

        <p><xsl:value-of select="description"/></p>

        <a href="#" class="btn btn-custom mb-4">Apply Now</a>

        <div class="row mb-4">
          <!-- Requirements -->
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  <i class="bi bi-list-check me-2"></i>Requirements
                </h5>
                <ul class="mb-0">
                  <xsl:for-each select="requirements/item">
                    <li><xsl:value-of select="."/></li>
                  </xsl:for-each>
                </ul>
              </div>
            </div>
          </div>

          <!-- Eligibility -->
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  <i class="bi bi-person-check me-2"></i>Eligibility
                </h5>
                <ul class="mb-0">
                  <xsl:for-each select="eligibility/item">
                    <li><xsl:value-of select="."/></li>
                  </xsl:for-each>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h5 class="fw-bold">Benefits</h5>
        <p><xsl:value-of select="benefits/coverage"/></p>
        <p>
          <strong>Scholarship Amount:</strong>
          <span class="dark-blue-color">
            <xsl:value-of select="benefits/amount"/>
          </span>
        </p>
      </section>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
