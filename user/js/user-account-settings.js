document.getElementById("editProfile").addEventListener("click", function () {
  const inputs = document.querySelectorAll("#firstName, #middleName, #lastName, #birthday, #gender, #contact");
  const saveButton = document.getElementById("saveProfile");
  
  const isEditing = this.textContent === "Edit";
  
  inputs.forEach(input => input.disabled = !isEditing);
  saveButton.classList.toggle("disabled", !isEditing);
  
  this.textContent = isEditing ? "Cancel" : "Edit";

  if (!isEditing) {
    inputs.forEach(input => input.classList.remove("is-invalid"));
  }
});


document.getElementById("saveProfile").addEventListener("click", function () {
  if (this.classList.contains("disabled")) return;

  const inputs = document.querySelectorAll("#firstName, #middleName, #lastName, #birthday, #gender, #contact");
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Incomplete Information',
      text: 'Please fill out all fields before saving.'
    });
    return;
  }

  Swal.fire({
    title: 'Enter Password to Confirm',
    html: `
      <div style="position: relative;">
        <input type="password" id="swal-password" class="swal2-input" placeholder="Password">
        <i id="toggle-password-icon" class="bi bi-eye-slash" style=""top: 75%; right: 10px; transform: translateY(-50%); cursor: pointer""></i>
      </div>
    `,
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const password = document.getElementById("swal-password").value;
      if (!password) {
        Swal.showValidationMessage("Password is required");
      }
      return password;
    },
    didOpen: () => {
      const toggleIcon = document.getElementById("toggle-password-icon");
      const passwordInput = document.getElementById("swal-password");

      toggleIcon.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        toggleIcon.classList.toggle("bi-eye");
        toggleIcon.classList.toggle("bi-eye-slash");
      });
    }
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Changes Saved',
        text: 'Your personal information has been updated.'
      });

      inputs.forEach(input => input.disabled = true);
      document.getElementById("saveProfile").classList.add("disabled");
    }
  });
});

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('bi-eye-slash');
      icon.classList.add('bi-eye');
    } else {
      input.type = 'password';
      icon.classList.remove('bi-eye');
      icon.classList.add('bi-eye-slash');
    }
  }

function isStrongPassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
}

document.getElementById('updatePasswordBtn').addEventListener('click', () => {
  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (currentPassword !== 'Pasig#2025') {
      Swal.fire({
      icon: 'error',
      title: 'Incorrect Current Password',
      text: 'The current password you entered is incorrect.',
      });
      return;
  }

  if (!isStrongPassword(newPassword)) {
      Swal.fire({
      icon: 'error',
      title: 'Weak Password',
      html: 'Password must be at least 8 characters long and include:<br>- Uppercase letter<br>- Lowercase letter<br>- Number<br>- Special character',
      });
      return;
  }

  if (newPassword !== confirmPassword) {
      Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'New password and confirm password do not match.',
      });
      return;
  }

  if (currentPassword === newPassword) {
      Swal.fire({
      icon: 'error',
      title: 'Invalid Password',
      text: 'New password must be different from the current password.',
      });
      return;
  }

  Swal.fire({
      title: 'Confirm Password Change',
      text: "Are you sure you want to update your password?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.isConfirmed) {
      Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: 'Your password has been successfully updated.',
      });
      }
  });
});