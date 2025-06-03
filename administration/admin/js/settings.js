$(document).ready(function () {
  $(".tab-nav button").click(function () {
    var tab = $(this).data("tab");

    $(".tab-nav button").removeClass("active");
    $(this).addClass("active");

    $(".tab-content").removeClass("active");
    $("#" + tab).addClass("active");
  });
});

document.addEventListener('click', function (e) {
  const toggle = e.target.closest('.accordion-toggle');
  if (toggle) {
    const accordion = toggle.parentElement;
    accordion.classList.toggle('active');
  }
});

document.addEventListener("click", function (e) {
  if (e.target.matches(".actions button") && e.target.textContent.trim() === "Delete Backup") {
    const accordionDiv = e.target.closest(".accordion");

    Swal.fire({
      title: 'Are you sure?',
      text: "This backup will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        accordionDiv.remove();
        Swal.fire(
          'Deleted!',
          'The backup has been deleted.',
          'success'
        );
      }
    });
  }
});

document.querySelector('button.primary').addEventListener('click', function () {
  Swal.fire({
    title: 'Create New Backup?',
    text: 'Do you want to create a new backup instance?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, create it',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Creating Backup...',
        text: 'Please wait while the backup is being created.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();

          setTimeout(() => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const size = (Math.random() * 2 + 22).toFixed(1);
            const records = Math.floor(Math.random() * 300 + 1000); 

            const accordion = document.createElement('div');
            accordion.classList.add('accordion');

            accordion.innerHTML = `
              <button class="accordion-toggle">
                <span class="text-black">Backup from ${dateStr}</span>
                <p>${timeStr} • ${size} MB</p>
              </button>
              <div class="accordion-content">
                <div class="info">
                  <p>Date Created: ${dateStr} ${timeStr}</p>
                  <p>Size: ${size} MB</p>
                  <p>Records: ${records} records</p>
                  <p>Status: Completed</p>
                </div>
                <div class="actions">
                  <button>Restore System</button>
                  <button>Download Backup</button>
                  <button>Delete Backup</button>
                </div>
              </div>
            `;
            const backupSection = document.querySelectorAll('.backup-section')[1]; 
            backupSection.insertBefore(accordion, backupSection.querySelector('.accordion'));

            Swal.fire('Backup Created!', 'Your backup has been successfully created.', 'success');
          }, 1500);
        }
      });
    }
  });
});


document.querySelectorAll('.actions button').forEach(button => {
  button.addEventListener('click', function () {
    const btnText = this.textContent.trim();

    if (btnText === 'Restore System') {
      Swal.fire({
        title: 'Restore System?',
        text: 'Restoring will delete any changes made since this backup. Do you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restore it',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Restoring System...',
            text: 'Please wait while the system is being restored.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              setTimeout(() => {
                Swal.fire('System Restored!', 'The system has been successfully restored.', 'success');
              }, 1500);
            }
          });
        }
      });

    } else if (btnText === 'Download Backup') {
      Swal.fire({
        title: 'Download Backup?',
        text: 'Do you want to download this backup?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, download',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Downloading...',
            text: 'Your backup is downloading.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();

              $.ajax({
                url: '../xml/application.xml',
                dataType: 'xml',
                success: function (data) {
                  let csvHeaders = [
                    'Applicant ID', 'Application Category', 'Affiliation', 'Type of ID', 'ID Number', 'GWA',
                    'Last Name', 'Middle Name', 'First Name', 'Gender', 'Date of Birth', 'Place of Birth', 'Age',
                    'Religion', 'Civil Status', 'Mobile Number', 'Email Address',
                    'Unit Number', 'House Number', 'Street Name', 'Barangay',
                    'School Year', 'Semester', 'School Name', 'School Address', 'School Type',
                    'Academic Grade Level', 'Academic Level', 'Course', 'Expected Graduation',
                    'Father Name', 'Father Occupation', 'Father Income',
                    'Mother Name', 'Mother Occupation', 'Mother Income',
                    'Combined Income',
                    'Previous School', 'Inclusive Years', 'Honors',
                    'Requirements',
                    'Date Submitted', 'Reviewed By', 'Date Reviewed', 'Status'
                  ];

                  let csv = csvHeaders.join(',') + '\n';

                  $(data).find('academic').each(function () {
                    const $a = $(this);

                    const pi = (tag) => $a.find(`personal_info > ${tag}`).text();
                    const ai = (tag) => $a.find(`address_information > ${tag}`).text();
                    const si = (tag) => $a.find(`school_information > ${tag}`).text();

                    const father = $a.find("family_information > family:has(relation:contains('Father'))");
                    const mother = $a.find("family_information > family:has(relation:contains('Mother'))");
                    const fi = (tag) => $a.find(`family_information > ${tag}`).text();

                    const edu = $a.find("educational_information > education");
                    const reqs = $a.find("requirements > requirement").map(function () {
                      return $(this).find("requirement_name").text();
                    }).get().join('; ');

                    const row = [
                      pi('applicant_id'), pi('application_category'), pi('affiliation'), pi('type_of_id'), pi('id_number'), pi('gwa'),
                      pi('last_name'), pi('middle_name'), pi('first_name'), pi('gender'), pi('date_of_birth'), pi('place_of_birth'), pi('age'),
                      pi('religion'), pi('civil_status'), pi('mobile_number'), pi('email_address'),
                      ai('unit_number'), ai('house_number'), ai('street_name'), ai('barangay'),
                      si('school_year'), si('semester'), si('name_of_school'), si('school_address'), si('school_type'),
                      si('academic_grade_level'), si('academic_level'), si('course'), si('expected_date_of_grad'),
                      `${father.find("first_name").text()} ${father.find("middle_name").text()} ${father.find("last_name").text()}`, father.find("occupation").text(), father.find("monthly_income").text(),
                      `${mother.find("first_name").text()} ${mother.find("middle_name").text()} ${mother.find("last_name").text()}`, mother.find("occupation").text(), mother.find("monthly_income").text(),
                      fi('combined_monthly_income'),
                      edu.find("name_of_school").text(), edu.find("inclusive_years").text(), edu.find("honors_and_awards").text(),
                      `"${reqs}"`,
                      $a.find('date_submitted').text(), $a.find('reviewed_by').text(), $a.find('date_reviewed').text(), $a.find('status').text()
                    ];

                    csv += row.map(item => `"${item}"`).join(',') + '\n';
                  });

                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', 'backup_applications.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  setTimeout(() => {
                    Swal.fire('Download Complete!', 'Backup has been downloaded successfully.', 'success');
                  }, 500);
                },
                error: function () {
                  Swal.fire('Error!', 'Failed to load XML file.', 'error');
                }
              });
            }
          });
        }

      });
    }
  });
});

document.querySelectorAll('.accordion-toggle').forEach(toggle => {
  toggle.addEventListener('click', function () {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  });
});

const toggles = document.querySelectorAll('.scholarship-toggle');
const deadlines = document.querySelectorAll('.deadline');
const statuses = document.querySelectorAll('.status');

toggles.forEach((toggle, i) => {
  toggle.addEventListener('change', () => {
    const isChecked = toggle.checked;
    const deadlineInput = deadlines[i];
    const statusSpan = statuses[i];

    deadlineInput.disabled = !isChecked;

    if (!isChecked) {
      deadlineInput.value = '';
      statusSpan.textContent = 'Status: Applications Closed';
      statusSpan.classList.remove('text-success');
      statusSpan.classList.add('text-danger');
    } else {
      if (!deadlineInput.value) {
        const today = new Date();
        const defaultDate = new Date(today.setDate(today.getDate() + 30));
        deadlineInput.value = defaultDate.toISOString().slice(0, 10);
      }
      const formattedDate = new Date(deadlineInput.value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      statusSpan.textContent = `Status: Applications Open until ${formattedDate}`;
      statusSpan.classList.remove('text-danger');
      statusSpan.classList.add('text-success');
    }
  });

  deadlines[i].addEventListener('change', () => {
    const deadlineInput = deadlines[i];
    const statusSpan = statuses[i];
    if (deadlineInput.value) {
      const formattedDate = new Date(deadlineInput.value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      statusSpan.textContent = `Status: Applications Open until ${formattedDate}`;
      statusSpan.classList.remove('text-danger');
      statusSpan.classList.add('text-success');
    }
  });
});

const createBtn = document.getElementById("createBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formSection = document.getElementById("createAnnouncementSection");
const listSection = document.getElementById("announcementSection");
const form = document.getElementById("announcementForm");
const cardsContainer = document.getElementById("announcementCards");
let editingCard = null;

createBtn.onclick = () => {
  form.reset();
  editingCard = null;
  formSection.classList.remove("d-none");
  listSection.classList.add("d-none");
};

cancelBtn.onclick = () => {
  formSection.classList.add("d-none");
  listSection.classList.remove("d-none");
};

form.onsubmit = function (e) {
  e.preventDefault();

  Swal.fire({
    title: 'Submit this post?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, submit',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      const type = form.type.value;
      const title = form.title.value;
      const subject = form.subject.value;
      const content = form.content.value;
      const postDate = form.postDate.value;
      const expiryDate = form.expiryDate.value;

      const typeBadge = {
        general: "bg-secondary",
        important: "bg-warning",
        deadline: "bg-danger",
        event: "bg-success"
      };

      if (editingCard) {
        editingCard.querySelector(".badge").className = `badge ${typeBadge[type]} mb-2`;
        editingCard.querySelector(".badge").innerText = type.charAt(0).toUpperCase() + type.slice(1);
        editingCard.querySelector(".card-title").innerText = title;
        editingCard.querySelector(".card-subtitle").innerText = subject;
        editingCard.querySelector(".card-text").innerText = content;
        editingCard.querySelector(".card-footer").innerHTML = `
          <div>Post: ${postDate}</div>
          <div>Expires: ${expiryDate}</div>`;
      } else {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-3";
        col.setAttribute("data-id", "5");
        col.innerHTML = `
          <div class="card position-relative h-100">
            <div class="card-body">
              <span class="badge ${typeBadge[type]} mb-2 text-capitalize">${type}</span>
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle text-muted mb-2">${subject}</h6>
              <p class="card-text d-none">${content}</p>
            </div>
            <div class="card-footer d-flex justify-content-between small text-muted">
              <div>Post: ${postDate}</div>
              <div>Expires: ${expiryDate}</div>
            </div>
            <div class="position-absolute top-0 end-0 p-2">
              <i class="bi bi-pencil-square text-primary me-2 edit-btn" role="button"></i>
              <i class="bi bi-trash-fill text-danger delete-btn" role="button"></i>
            </div>
          </div>
        `;
        cardsContainer.appendChild(col);
      }

      form.reset();
      formSection.classList.add("d-none");
      listSection.classList.remove("d-none");

      Swal.fire(
        'Submitted!',
        'Your post has been saved.',
        'success'
      );
    }
  });
};

cardsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This item will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        e.target.closest(".col-md-3").remove();
        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        );
      }
    });
  }

  if (e.target.classList.contains("edit-btn")) {
    editingCard = e.target.closest(".card");
    const type = editingCard.querySelector(".badge").innerText.toLowerCase();
    const title = editingCard.querySelector(".card-title").innerText;
    const subject = editingCard.querySelector(".card-subtitle").innerText;
    const content = editingCard.querySelector(".card-text").innerText;
    const postDate = editingCard.querySelector(".card-footer").children[0].innerText.replace("Post: ", "");
    const expiryDate = editingCard.querySelector(".card-footer").children[1].innerText.replace("Expires: ", "");

    form.type.value = type;
    form.title.value = title;
    form.subject.value = subject;
    form.content.value = content;
    form.postDate.value = postDate;
    form.expiryDate.value = expiryDate;

    formSection.classList.remove("d-none");
    listSection.classList.add("d-none");
  }
});

$('.subtab').on('click', function () {
  $('.subtab').removeClass('active');
  $(this).addClass('active');

  const tab = $(this).data('tab');
  $('.tab-pane').removeClass('active');
  $('#' + tab).addClass('active');
});



document.getElementById("changePasswordBtn").addEventListener("click", function () {
  const currentPassword = document.getElementById("currentPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const requiredCurrent = "Pasig_Admin#2025";
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (currentPassword !== requiredCurrent) {
    Swal.fire("Incorrect Current Password", "Please enter the correct current password.", "error");
    return;
  }

  if (!passwordRegex.test(newPassword)) {
    Swal.fire("Weak Password", "New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.", "warning");
    return;
  }

  if (newPassword !== confirmPassword) {
    Swal.fire("Password Mismatch", "New password and confirm password do not match.", "error");
    return;
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const userEmail = "pineda_jariusmaui@plpasig.edu.ph"; 

  emailjs.send("service_l53qafo", "template_mzv1dvi", {
    to_email: userEmail,
    verification_code: verificationCode
  }).then(() => {
    Swal.fire({
      title: "Email Verification",
      input: "text",
      inputLabel: "Enter the 6-digit code sent to your email",
      inputPlaceholder: "Enter verification code",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to enter the code!";
        if (value !== verificationCode) return "Incorrect code.";
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value === verificationCode) {
        Swal.fire({
          title: "Confirm Password Change",
          text: "Are you sure you want to change your password?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, change it",
          cancelButtonText: "Cancel"
        }).then((res) => {
          if (res.isConfirmed) {
            Swal.fire("Success", "Your password has been changed!", "success");

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";
          }
        });
      }
    });
  }).catch((error) => {
    console.error("EmailJS Error:", error);
    Swal.fire("Error", "Failed to send verification code via email.", "error");
  });
});


document.getElementById("createAccountBtn").addEventListener("click", function () {
  const email = document.getElementById("accountEmail").value.trim();
  const role = document.getElementById("accountRole").value.trim();
  const password = document.getElementById("accountPassword").value.trim();
  const confirmPassword = document.getElementById("accountConfirmPassword").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!emailRegex.test(email)) {
    Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
    return;
  }

  if (!role) {
    Swal.fire("Missing Role", "Please select a role.", "warning");
    return;
  }

  if (!passwordRegex.test(password)) {
    Swal.fire("Weak Password", "Password must be at least 8 characters and include uppercase, lowercase, and a number.", "warning");
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire("Password Mismatch", "Passwords do not match.", "error");
    return;
  }

  Swal.fire({
    title: "Confirm Account Creation",
    text: "Are you sure you want to create this account?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, create it",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Success", "The new account has been created.", "success");

      document.getElementById("accountEmail").value = "";
      document.getElementById("accountRole").value = "";
      document.getElementById("accountPassword").value = "";
      document.getElementById("accountConfirmPassword").value = "";
    }
  });
});

document.getElementById("createAccountBtn").addEventListener("click", function () {
  const email = document.getElementById("accountEmail").value.trim();
  const role = document.getElementById("accountRole").value.trim();
  const password = document.getElementById("accountPassword").value.trim();
  const confirmPassword = document.getElementById("accountConfirmPassword").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!emailRegex.test(email)) {
    Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
    return;
  }

  if (!role) {
    Swal.fire("Missing Role", "Please select a role.", "warning");
    return;
  }

  if (!passwordRegex.test(password)) {
    Swal.fire("Weak Password", "Password must be at least 8 characters and include uppercase, lowercase, and a number.", "warning");
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire("Password Mismatch", "Passwords do not match.", "error");
    return;
  }

  Swal.fire({
    title: "Confirm Account Creation",
    text: "Are you sure you want to create this account?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, create it",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      const accountList = document.querySelector(".account-list");
      const card = document.createElement("div");
      card.className = "card mb-3 position-relative";
      card.innerHTML = `
        <div class="position-absolute top-0 end-0 p-2">
          <button class="btn btn-sm btn-outline-danger" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body">
          <p class="card-text mb-1 fw-bold">${email}</p>
          <p class="card-text mb-1 small">${role.toLowerCase()}</p>
          <p class="card-text"><small class="text-muted">Created: ${new Date().toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</small></p>
        </div>
      `;
      accountList.prepend(card);

      document.getElementById("accountEmail").value = "";
      document.getElementById("accountRole").value = "";
      document.getElementById("accountPassword").value = "";
      document.getElementById("accountConfirmPassword").value = "";

      Swal.fire("Success", "The new account has been created.", "success");
    }
  });
});

document.querySelector(".account-list").addEventListener("click", function (e) {
  if (e.target.closest("button")?.title === "Delete") {
    Swal.fire({
      title: "Delete Account",
      text: "Are you sure you want to delete this account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        e.target.closest(".card").remove();
        Swal.fire("Deleted!", "Account has been removed.", "success");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.querySelector('.save-btn');
    const today = new Date().toISOString().split('T')[0];

    saveBtn.addEventListener("click", function (e) {
      const dateInputs = document.querySelectorAll('.deadline');
      let invalidFields = [];

      dateInputs.forEach(input => {
        if (!input.disabled && input.closest('.custom-card')?.querySelector('.scholarship-toggle')?.checked) {
          const value = input.value;
          if (!value) {
            invalidFields.push("Some deadlines are empty.");
          } else if (value < today) {
            invalidFields.push(`"${value}" is earlier than today.`);
          }
        }
      });

      if (invalidFields.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Date input error',
          html: invalidFields.map(err => `<div>${err}</div>`).join(''),
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: "All data is valid. Do you want to save the changes?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#198754',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, save it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Saved!',
              text: 'Your changes have been saved successfully.',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  });