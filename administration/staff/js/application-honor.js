document.addEventListener("DOMContentLoaded", async () => {
  const applicationListSection = document.getElementById("applicationList");
  const applicationDetailsSection =
    document.getElementById("applicationDetails");
  const backToListButton = document.getElementById("backToList");
  const statusSelect = document.getElementById("applicationStatus");
  const rejectionReasonContainer = document.getElementById(
    "rejectionReasonContainer"
  );
  const saveChangesButton = document.getElementById("saveChanges");

  let xmlData = null;
  let dataTable = null;
  let currentApplicantId = null;

  async function loadXMLDoc(filename) {
    const response = await fetch(filename);
    if (!response.ok)
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "application/xml");
  }

  async function transform() {
    try {
      xmlData = await loadXMLDoc("../xml/application.xml");
      const xslDoc = await loadXMLDoc("../xsl/application-honor.xsl");

      if (window.XSLTProcessor) {
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        const resultFragment = xsltProcessor.transformToFragment(
          xmlData,
          document
        );

        applicationListSection.innerHTML = "";
        applicationListSection.appendChild(resultFragment);

        initializeTableFeatures();
      } else {
        applicationListSection.innerText =
          "XSLT not supported in this browser.";
      }
    } catch (error) {
      applicationListSection.innerText = "Error loading XML or XSL files.";
      console.error(error);
    }
  }

  function initializeTableFeatures() {
    dataTable = $("#scholarshipTable").DataTable({
      dom: "Brt",
      buttons: [
        {
          extend: "csvHtml5",
          title: "Scholarship_Applications",
          text: "Export",
          className: "hidden-dt-export",
        },
      ],
      paging: false,
      ordering: true,
      searching: true,
    });

    $("#customSearch").on("keyup", function () {
      dataTable.search(this.value).draw();
    });

    $("#exportButton").on("click", function () {
      $(".hidden-dt-export").click();
    });
  }

  function populateDetails(app) {
    currentApplicantId =
      app.getElementsByTagName("applicant_id")[0]?.textContent || null;

    const get = (tag) => app.getElementsByTagName(tag)[0]?.textContent || "N/A";
    const fullname = [get("first_name"), get("middle_name"), get("last_name")]
      .filter(Boolean)
      .join(" ");

    const detailMapping = {
      "detail-application-category": "application_category",
      "detail-applicant-id": "applicant_id",
      "detail-affiliation": "affiliation",
      "detail-type-of-id": "type_of_id",
      "detail-id-number": "id_number",
      "detail-gwa": "gwa",
      "detail-full-name": fullname,
      "detail-gender": "gender",
      "detail-date-of-birth": "date_of_birth",
      "detail-place-of-birth": "place_of_birth",
      "detail-age": "age",
      "detail-religion": "religion",
      "detail-civil-status": "civil_status",
      "detail-mobile-number": "mobile_number",
      "detail-email-address": "email_address",
      "detail-unit-number": "unit_number",
      "detail-house-number": "house_number",
      "detail-street-name": "street_name",
      "detail-barangay": "barangay",
      "detail-school-year": "school_year",
      "detail-semester": "semester",
      "detail-school-name": "name_of_school",
      "detail-school-address": "school_address",
      "detail-school-type": "school_type",
      "detail-academic-grade-level": "academic_level",
      "detail-course": "course",
      "detail-expected-grad-date": "expected_date_of_graduation",
      "combined-monthly-income": "combined_monthly_income",
    };

    for (const [elementId, xmlTag] of Object.entries(detailMapping)) {
      if (elementId === "detail-full-name") {
        document.getElementById(elementId).innerText = fullname || "N/A";
      } else {
        document.getElementById(elementId).innerText = get(xmlTag);
      }
    }

    const status = get("status").toLowerCase() || "pending";
    const approvedBy = get("reviewed_by") || "";
    const dateApproved = get("date_reviewed") || "";

    document.getElementById("applicationStatus").value = status;
    document.getElementById("approvedBy").value = approvedBy;
    document.getElementById("approvalDate").value = dateApproved;

    if (rejectionReasonContainer) {
      rejectionReasonContainer.classList.toggle(
        "d-none",
        status !== "rejected"
      );
    }

    const familyInfoBody = document.getElementById("family-info-body");
    familyInfoBody.innerHTML = "";
    const familyInfo = app.getElementsByTagName("family_information")[0];
    const familyMembers = familyInfo
      ? familyInfo.getElementsByTagName("family")
      : [];
    for (let member of familyMembers) {
      const createCellText = (tagName) =>
        member.getElementsByTagName(tagName)[0]?.textContent || "";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${createCellText("relation")}</td>
        <td>${createCellText("first_name")}</td>
        <td>${createCellText("middle_name")}</td>
        <td>${createCellText("last_name")}</td>
        <td>${createCellText("occupation")}</td>
        <td>${createCellText("monthly_income")}</td>
      `;
      familyInfoBody.appendChild(row);
    }

    const educInfoBody = document.getElementById("educ-info-body");
    educInfoBody.innerHTML = "";
    const educInfo = app.getElementsByTagName("educational_information")[0];
    const educLevels = educInfo
      ? educInfo.getElementsByTagName("education")
      : [];
    for (let level of educLevels) {
      const createCellText = (tagName) =>
        level.getElementsByTagName(tagName)[0]?.textContent || "";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${createCellText("academic_level_type")}</td>
        <td>${createCellText("name_of_school")}</td>
        <td>${createCellText("inclusive_years")}</td>
        <td>${createCellText("honors_and_awards")}</td>
      `;
      educInfoBody.appendChild(row);
    }

    const requirements = [
      { name: "Essay", file: "essay.pdf" },
      { name: "Interview Intake Form", file: "interview_form.pdf" },
      { name: "Barangay Certification of Residency", file: "brgy_cert.jfif" },
      { name: "Front of Valid ID", file: "id_front.jfif" },
      { name: "Back of Valid ID", file: "id_back.jfif" },
      { name: "Report Card", file: "card.jfif" },
      { name: "Proof of Enrollment", file: "cor.jfif" },
      { name: "1x1 Photo", file: "1x1.jfif" },
      { name: "Proof of Income", file: "income.jfif" },
    ];

    const requirementsBody = document.getElementById("requirements-body");
    requirementsBody.innerHTML = "";

    requirements.forEach((req) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${req.name}</td>
        <td>${req.file}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary action-btn" data-file="${req.file}" type="button" aria-label="View ${req.name}">
            <i class="bi bi-download"></i>
          </button>
        </td>
      `;
      requirementsBody.appendChild(tr);
    });

    requirementsBody.replaceWith(requirementsBody.cloneNode(true));

    document
      .getElementById("requirements-body")
      .addEventListener("click", async (e) => {
        const button = e.target.closest(".action-btn");
        if (!button) return;

        const fileName = button.getAttribute("data-file");
        if (!fileName) return;

        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        button.innerHTML = `<i class="bi bi-eye"></i>`;
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-outline-custom");
        button.disabled = false;

        button.onclick = () => {
          window.open(`../asset/${fileName}`, "_blank", "noopener,noreferrer");
        };
      });
  }

  applicationListSection.addEventListener("click", (e) => {
    const button = e.target.closest(".btn.btn-sm.btn-primary");
    if (!button) return;

    const applicantId = button.getAttribute("data-id");
    if (!applicantId || !xmlData) return;

    const applications = xmlData.getElementsByTagName("college_honor_graduates");
    let matchedApp = null;

    for (let app of applications) {
      const currentId =
        app.getElementsByTagName("applicant_id")[0]?.textContent;
      if (currentId === applicantId) {
        matchedApp = app;
        break;
      }
    }

    if (matchedApp) {
      populateDetails(matchedApp);
      applicationListSection.classList.add("d-none");
      applicationDetailsSection.classList.remove("d-none");
    }
  });

  backToListButton?.addEventListener("click", () => {
    applicationDetailsSection.classList.add("d-none");
    applicationListSection.classList.remove("d-none");
  });

  statusSelect?.addEventListener("change", function () {
    if (rejectionReasonContainer) {
      rejectionReasonContainer.classList.toggle(
        "d-none",
        this.value !== "rejected"
      );
    }
  });

  saveChangesButton?.addEventListener("click", () => {
    if (!currentApplicantId || !dataTable) return;

    const newStatus = statusSelect.value;

    const rowIndex = dataTable
      .rows()
      .indexes()
      .filter((i) => {
        const data = dataTable.row(i).data();
        return data.some((cell) => cell.includes(currentApplicantId));
      })[0];

    if (rowIndex !== undefined) {
      const rowData = dataTable.row(rowIndex).data();

      for (let i = 0; i < rowData.length; i++) {
        if (
          typeof rowData[i] === "string" &&
          /pending|accepted|rejected|approved|denied/i.test(rowData[i])
        ) {
          const statusText =
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

          const statusClassMap = {
            pending: "badge pending",
            approved: "badge approved",
            rejected: "badge rejected",
            denied: "badge denied",
          };

          const badgeClass =
            statusClassMap[newStatus.toLowerCase()] || "badge bg-secondary";

          rowData[i] = `<span class="${badgeClass}">${statusText}</span>`;

          dataTable.row(rowIndex).data(rowData).draw(false);

          break;
        }
      }
    }

    if (xmlData) {
      const applications = xmlData.getElementsByTagName("college_honor_graduates");
      for (let app of applications) {
        const currentId =
          app.getElementsByTagName("applicant_id")[0]?.textContent;
        if (currentId === currentApplicantId) {
          const statusNode = app.getElementsByTagName("status")[0];
          if (statusNode) {
            statusNode.textContent = newStatus;
          }
          break;
        }
      }
    }

    applicationDetailsSection.classList.add("d-none");
    applicationListSection.classList.remove("d-none");
  });

  await transform();
});
