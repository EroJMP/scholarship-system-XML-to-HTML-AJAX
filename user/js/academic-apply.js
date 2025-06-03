$(document).ready(function () {
  $(".tab-nav button").click(function () {
      var tab = $(this).data("tab");

       e.preventDefault();


      /* for debugging
      $(".tab-nav button").removeClass("active");
      $(this).addClass("active");
      $(".tab-content").removeClass("active");
      $("#" + tab).addClass("active");
      */
  });

  $(".btn-primary").click(function (e) {
    e.preventDefault();

    var currentTab = $(".tab-nav button.active");
    var nextTab = currentTab.next("button");
    var currentContent = $("#" + currentTab.data("tab"));
    var isValid = true;

    currentContent.find("input, select, textarea").each(function () {
      if (!this.checkValidity()) {
        isValid = false;
        $(this).addClass("is-invalid");
      } else {
        $(this).removeClass("is-invalid");
      }
    });

    if (!isValid) {
      currentContent.find(".is-invalid").first()[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (!nextTab.length) {
      Swal.fire({
        title: "Review Application?",
        text: "You’re about to proceed to the final review page.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../pages/academic-apply-details.html";
        }
      });
    } else {
      currentTab.removeClass("active");
      nextTab.addClass("active");

      $(".tab-content").removeClass("active");
      $("#" + nextTab.data("tab")).addClass("active");
    }
  });

  $(".btn-secondary").click(function (e) {
      e.preventDefault();
      var currentTab = $(".tab-nav button.active");
      var prevTab = currentTab.prev("button");
      if (prevTab.length) {
          currentTab.removeClass("active");
          prevTab.addClass("active");

          $(".tab-content").removeClass("active");
          $("#" + prevTab.data("tab")).addClass("active");
      }
  });
});

const accordionToggles = document.querySelectorAll('.accordion-toggle');
accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
        const accordion = this.parentElement;
        accordion.classList.toggle('active');
    });
});

let rowCount = 0;

function addRow() {
  const tableBody = document.querySelector("#familyTable tbody");

  const rows = tableBody.querySelectorAll("tr");
  let lastEditableInputs = [];

  for (let i = rows.length - 1; i >= 0; i--) {
    const inputs = rows[i].querySelectorAll("input:not(:disabled)");
    if (inputs.length > 0) {
      lastEditableInputs = inputs;
      break;
    }
  }

  let allFilled = true;
  lastEditableInputs.forEach((input) => {
    if (input.hasAttribute("required") && input.value.trim() === "") {
      input.classList.add("is-invalid");
      allFilled = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (!allFilled) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please complete all required fields in the current row before adding a new one.',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  rowCount++;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td>
      <div class="input-group input-group-sm">
        <span class="input-group-text">₱</span>
        <input type="number" class="form-control income-input" oninput="updateCombinedIncome()" disabled required>
      </div>
    </td>
    <td>
      <div class="d-flex gap-1">
        <button class="btn btn-sm fs-4" onclick="toggleEdit(this)">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm fs-4" onclick="toggleDelete(this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </td>
  `;
  tableBody.appendChild(row);
}


function toggleDelete(button) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This row will be removed.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const row = button.closest("tr");
      row.remove();

      const tableBody = document.querySelector("#familyTable tbody");
      const rows = tableBody.querySelectorAll("tr");

      rowCount = 0;
      rows.forEach((row, index) => {
        rowCount = index + 1;
        const numberCell = row.querySelector("td:first-child");
        numberCell.textContent = rowCount;
      });

      updateCombinedIncome();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The row has been removed.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function toggleEdit(button) {
  const row = button.closest("tr");
  const inputs = row.querySelectorAll("input");
  const disabled = inputs[0].disabled;
  inputs.forEach(input => {
    input.disabled = !disabled;
    if (!input.disabled && input.classList.contains("income-input")) {
      input.addEventListener("input", updateCombinedIncome);
    }
  });
}

function updateCombinedIncome() {
  const incomeInputs = document.querySelectorAll(".income-input");
  let total = 0;
  incomeInputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });

  document.getElementById("combinedIncome").textContent = `₱${total.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
  
let educationRowCount = 0;

function addEducationRow() {
  const tableBody = document.querySelector("#educationTable tbody");

  const rows = tableBody.querySelectorAll("tr");
  let lastEditableInputs = [];

  for (let i = rows.length - 1; i >= 0; i--) {
    const inputs = rows[i].querySelectorAll("input:not(:disabled)");
    if (inputs.length > 0) {
      lastEditableInputs = inputs;
      break;
    }
  }

  let allFilled = true;
  lastEditableInputs.forEach((input) => {
    if (input.hasAttribute("required") && input.value.trim() === "") {
      input.classList.add("is-invalid");
      allFilled = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (!allFilled) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'Please complete all required fields in the current row before adding a new one.',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  educationRowCount++;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${educationRowCount}</td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td><input type="text" class="form-control form-control-sm" disabled required></td>
    <td>
      <div class="d-flex gap-1">
        <button class="btn btn-sm fs-4" onclick="toggleEducationEdit(this)">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm fs-4" onclick="toggleEducationDelete(this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </td>
  `;
  tableBody.appendChild(row);
}

function toggleEducationDelete(button) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This education row will be deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const row = button.closest("tr");
      row.remove();

      const tableBody = document.querySelector("#educationTable tbody");
      const rows = tableBody.querySelectorAll("tr");

      educationRowCount = 0;
      rows.forEach((row, index) => {
        educationRowCount = index + 1;
        const numberCell = row.querySelector("td:first-child");
        numberCell.textContent = educationRowCount;
      });

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The row has been removed.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}



function toggleEducationEdit(button) {
  const row = button.closest("tr");
  const inputs = row.querySelectorAll("input");
  const isDisabled = inputs[0].disabled;

  inputs.forEach(input => {
    input.disabled = !input.disabled;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const detailsButtons = document.querySelectorAll(".open-details");

  detailsButtons.forEach(button => {
    button.addEventListener("click", function () {
      const requirement = this.getAttribute("data-requirement");
      const description = this.getAttribute("data-description");

      document.getElementById("modalRequirementTitle").textContent = requirement;
      document.getElementById("modalRequirementDescription").textContent = description;
    });
  });

  const fileInputs = document.querySelectorAll(".file-upload");

  fileInputs.forEach(input => {
    input.setAttribute("accept", "application/pdf");

    input.addEventListener("change", function () {
      const requirementName = this.getAttribute("data-requirement");
      const file = this.files[0];

      if (file) {
        if (file.type !== "application/pdf") {
          Swal.fire({
            icon: 'error',
            title: 'Invalid File',
            text: 'Only PDF files are allowed.',
          });
          this.value = ""; 
          return;
        }

        console.log(`Uploaded ${file.name} for ${requirementName}`);
      }
    });
  });
});


const scholarshipTitles = {
    1: "Academic Scholarship Application",
    2: "Private School-Endorsed Scholarship Application",
    3: "Sports Scholarship Application",
    4: "Financial Assistance for Bar & Board Licensure Examinations",
    5: "Incentives for College Honor Graduates Application",
    6: "Scholarship for Sangguniang Kabataan Officials Application",
    7: "Out-of-School Learners Scholarship Application",
    8: "CHIP-in Scholarship Application" 
};

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id && scholarshipTitles[id]) {
    $(".font-color-title").text(scholarshipTitles[id]);
    document.title = scholarshipTitles[id];
}
