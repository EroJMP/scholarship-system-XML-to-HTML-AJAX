<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:html="http://www.w3.org/1999/xhtml">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <!-- application data section-->
    <h2 class="section-title d-flex justify-content-between align-items-center fw-bold fs-2">
      Sports Scholarship Applications
      <div class="table-controls d-flex gap-2">
        <input type="text" id="customSearch" class="form-control search-input" placeholder="Search applications..." />
      </div>
    </h2>
    
    <div class="bg-white p-4 rounded shadow-lg w-100 h-100">
      <table id="scholarshipTable" class="display">
        <thead>
          <tr>
            <th>Applicant ID</th>
            <th>Applicant Name</th>
            <th>Category</th>
            <th>Affiliation</th>
            <th>Academic Level</th>
            <th>Barangay</th>
            <th>Date Submitted</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <xsl:for-each select="applications/application[@category='sports']/sports">
            <tr>
              <td><xsl:value-of select="personal_info/applicant_id"/></td>
              <td>
                <xsl:value-of select="personal_info/first_name"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="personal_info/middle_name"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="personal_info/last_name"/>
              </td>
              <td><xsl:value-of select="personal_info/application_category"/></td>
              <td><xsl:value-of select="personal_info/affiliation"/></td>
              <td><xsl:value-of select="school_information/academic_level"/></td>
              <td><xsl:value-of select="address_information/barangay"/></td>
              <td><xsl:value-of select="date_submitted"/></td>
              <td>
                <xsl:choose>
                  <xsl:when test="status = 'Approved'">
                    <span class="badge approved">Approved</span>
                  </xsl:when>
                  <xsl:when test="status = 'Rejected'">
                    <span class="badge rejected">Rejected</span>
                  </xsl:when>
                  <xsl:when test="status = 'Pending'">
                    <span class="badge pending">Pending</span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="badge bg-secondary">Unknown</span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
              <td>
                  <button class="btn btn-sm btn-primary" data-id="{personal_info/applicant_id}"><i class="fs-4 bi bi-folder-symlink"></i></button>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  
  </xsl:template>
</xsl:stylesheet>
