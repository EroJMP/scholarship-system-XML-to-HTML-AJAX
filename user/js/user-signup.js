document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.policy-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const policyType = this.getAttribute('data-policy');
      const modalTitle = document.getElementById('policyModalLabel');
      const termsContent = document.getElementById('termsContent');
      const privacyContent = document.getElementById('privacyContent');

      if (policyType === 'terms') {
        modalTitle.textContent = 'Terms of Service';
        termsContent.classList.remove('d-none');
        privacyContent.classList.add('d-none');
      } else if (policyType === 'privacy') {
        modalTitle.textContent = 'Privacy Policy';
        privacyContent.classList.remove('d-none');
        termsContent.classList.add('d-none');
      }

      const policyModal = new bootstrap.Modal(document.getElementById('policyModal'));
      policyModal.show();
    });
  });

  const termsCheck = document.getElementById('termsCheck');
  const submitBtn = document.querySelector("button[type='submit']");
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordHelp = document.getElementById("passwordHelp");
  const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const togglePasswordIcon = document.getElementById("togglePasswordIcon");
  const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");
  const toggleConfirmPasswordIcon = document.getElementById("toggleConfirmPasswordIcon");

  let canSubmit = false;
  submitBtn.disabled = true;

  termsCheck.addEventListener('change', function () {
    canSubmit = this.checked;
    submitBtn.disabled = !canSubmit;
  });

  togglePasswordBtn.addEventListener("click", function() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordIcon.classList.toggle("bi-eye");
    togglePasswordIcon.classList.toggle("bi-eye-slash");
  });

  toggleConfirmPasswordBtn.addEventListener("click", function() {
    const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";
    confirmPasswordInput.setAttribute("type", type);
    toggleConfirmPasswordIcon.classList.toggle("bi-eye");
    toggleConfirmPasswordIcon.classList.toggle("bi-eye-slash");
  });

  function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  (function(){
      emailjs.init({
        publicKey: "wzXgijBftES2PKfLj",
      });
  })();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!canSubmit || !termsCheck.checked) {
      Swal.fire({
        icon: "error",
        title: "Action Blocked",
        text: "You must agree to the terms before proceeding.",
      });
      return;
    }

    const passValue = passwordInput.value;
    const confirmValue = confirmPasswordInput.value;

    passwordHelp.classList.add("d-none");
    confirmPasswordHelp.classList.add("d-none");

    if (!isPasswordStrong(passValue)) {
      passwordHelp.classList.remove("d-none");
      return;
    }

    if (passValue !== confirmValue) {
      confirmPasswordHelp.classList.remove("d-none");
      return;
    }

    submitBtn.disabled = true;

    emailjs.send("service_l53qafo", "template_vamjfne", {
      to_email: emailInput.value,
    }).then(() => {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "A verification email has been sent to your email address.",
        confirmButtonColor: "#0d6efd"
      }).then(() => {
        window.location.href = "user-login.html";
      });

      form.reset();
      canSubmit = false;
      submitBtn.disabled = true;
    }).catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while sending the verification email.",
      });
      console.error("EmailJS Error:", error);
      submitBtn.disabled = false;
    });
  });
});
