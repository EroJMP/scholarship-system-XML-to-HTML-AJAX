<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:html="http://www.w3.org/1999/xhtml">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <!-- application data section-->
    <h2 class="section-title d-flex justify-content-between align-items-center fw-bold fs-2">
      Application's Report
      <div class="table-controls d-flex gap-2">
        <input type="text" id="customSearch" class="form-control search-input" placeholder="Search applications..." />
        <div id="exportContainer" style="position: relative; display: inline-block;">
          <button id="exportButton" class="btn btn-custom export-btn">
            <i class="bi bi-download me-1"></i> Export
          </button>
          <ul id="exportDropdown" style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #ccc; list-style: none; padding: 0; margin: 4px 0; width: 300px;" class="fs-5 text-center">
            <li><a href="#" class="export-option" data-category="all">Export All</a></li>
            <li><a href="#" class="export-option" data-category="Academic Scholarship">Academic Scholarship</a></li>
            <li><a href="#" class="export-option" data-category="Private Scholarship">Private School-Endorsed Scholarship</a></li>
            <li><a href="#" class="export-option" data-category="Sports Scholarship">Sports Scholarship</a></li>
            <li><a href="#" class="export-option" data-category="Bar and Board Assistance">Financial Assistance for Bar and Board Licensure</a></li>
            <li><a href="#" class="export-option" data-category="Honor Incentives">Incentives for College Honor Graduates</a></li>
            <li><a href="#" class="export-option" data-category="SK Scholarship">Sangguniang Kabataan Officials Scholarship</a></li>
            <li><a href="#" class="export-option" data-category="OSL Scholarship">Out-of-School Learners Scholarship</a></li>
            <li><a href="#" class="export-option" data-category="Chip-in Scholarship">CHIP-in Scholarship</a></li>
          </ul>
        </div>

        <div id="postContainer" style="position: relative; display: inline-block;">
          <button id="postButton" class="btn btn-custom export-btn">
            <i class="bi bi-send me-1"></i> Post
          </button>
          <ul id="postDropdown" style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #ccc; list-style: none; padding: 0; margin: 4px 0; width: 300px;" class="fs-5 text-center">
            <li><a href="#" class="post-option" data-category="Academic Scholarship">Academic Scholarship</a></li>
            <li><a href="#" class="post-option" data-category="Private Scholarship">Private School-Endorsed Scholarship</a></li>
            <li><a href="#" class="post-option" data-category="Sports Scholarship">Sports Scholarship</a></li>
            <li><a href="#" class="post-option" data-category="Bar and Board Assistance">Financial Assistance for Bar and Board Licensure</a></li>
            <li><a href="#" class="post-option" data-category="Honor Incentives">Incentives for College Honor Graduates</a></li>
            <li><a href="#" class="post-option" data-category="SK Scholarship">Sangguniang Kabataan Officials Scholarship</a></li>
            <li><a href="#" class="post-option" data-category="OSL Scholarship">Out-of-School Learners Scholarship</a></li>
            <li><a href="#" class="post-option" data-category="Chip-in Scholarship">CHIP-in Scholarship</a></li>
          </ul>
        </div>
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
            <th>Approved By</th>
            <th>Date Approved</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            <xsl:for-each select="applications/application">
              <xsl:variable name="category" select="@category"/>
              <xsl:for-each select="*">
                <!-- Only show if status is 'approved' -->
                <xsl:if test="status = 'Approved'">
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
          
                    <!-- Affiliation: show 'NA' for specific categories -->
                    <td>
                      <xsl:choose>
                        <xsl:when test="$category = 'bar_and_board'">
                          NA
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="personal_info/affiliation"/>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
          
                    <!-- Academic Level: show 'NA' for specific categories -->
                    <td>
                      <xsl:choose>
                        <xsl:when test="$category = 'college_honor_graduates' or $category = 'bar_and_board'">
                          NA
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="school_information/academic_level"/>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
          
                    <td><xsl:value-of select="address_information/barangay"/></td>
                    <td><xsl:value-of select="reviewed_by"/></td>
                    <td><xsl:value-of select="date_reviewed"/></td>
                    <td><xsl:value-of select="status"/></td>
                  </tr>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </tbody>          
      </table>
    </div>
  </xsl:template>
</xsl:stylesheet>
