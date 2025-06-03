document.addEventListener("DOMContentLoaded", () => {
  emailjs.init('wzXgijBftES2PKfLj');

  const emailSection = document.getElementById('emailSection');
  const verificationSection = document.getElementById('verificationSection');
  const newPassSection = document.getElementById('newPassSection');

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');

  const codeInputs = document.querySelectorAll('.code-input');
  const verifyCodeBtn = document.getElementById('verifyCodeBtn');

  const newPasswordInput = document.getElementById('newPassword');
  const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
  const confirmBtn = document.getElementById('confirmBtn');

  const togglePasswordBtns = document.querySelectorAll('#togglePassword');

  let sentCode = '';
  let attemptsLeft = 5;
  let locked = false;

  function checkEmailInXML(email) {
    return fetch('../xml/user-login.xml')
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const emails = data.getElementsByTagName('email');
        for (let i = 0; i < emails.length; i++) {
          if (emails[i].textContent.trim().toLowerCase() === email.toLowerCase()) {
            return true;
          }
        }
        return false;
      });
  }

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function sendCodeEmail(toEmail, code) {
    return emailjs.send('service_l53qafo', 'template_mzv1dvi', {
      to_email: toEmail,
      verification_code: code
    });
  }

  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      } else {
        input.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      }
    });
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) return;

    const found = await checkEmailInXML(email);
    if (!found) {
      Swal.fire({
        icon: 'error',
        title: 'Email not found',
        text: 'The email you entered is not registered.',
      });
      return;
    }

    sentCode = generateCode();

    try {
      await sendCodeEmail(email, sentCode);
      Swal.fire({
        icon: 'success',
        title: 'Verification Code Sent',
        text: 'Please check your email for the 6-digit code.',
      });

      emailSection.style.display = 'none';
      verificationSection.style.display = 'flex';

      codeInputs[0].focus();

      attemptsLeft = 5;
      locked = false;

      codeInputs.forEach(input => (input.value = ''));

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to send email',
        text: 'Please try again later.',
      });
      console.error('EmailJS error:', error);
    }
  });

  codeInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && idx < codeInputs.length - 1) {
        codeInputs[idx + 1].focus();
      }
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && input.value.length === 0 && idx > 0) {
        codeInputs[idx - 1].focus();
      }
    });
  });

  verifyCodeBtn.addEventListener('click', () => {
    if (locked) {
      Swal.fire({
        icon: 'error',
        title: 'Account Locked',
        text: 'You have exceeded the maximum number of attempts.',
      });
      return;
    }

    const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
    if (enteredCode.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Code',
        text: 'Please enter the full 6-digit code.',
      });
      return;
    }

    if (enteredCode !== sentCode) {
      attemptsLeft--;
      if (attemptsLeft <= 0) {
        locked = true;
        Swal.fire({
          icon: 'error',
          title: 'Account Locked',
          text: 'You have exceeded the maximum number of attempts.',
        });
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Code',
        text: `The code is incorrect. You have ${attemptsLeft} attempts left.`,
      });
      codeInputs.forEach(input => (input.value = ''));
      codeInputs[0].focus();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Code Verified',
      text: 'You may now reset your password.',
    });

    verificationSection.style.display = 'none';
    newPassSection.style.display = 'flex';

    newPasswordInput.value = '';
    confirmNewPasswordInput.value = '';
  });

  function validatePassword(pw) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pw);
  }

  confirmBtn.addEventListener('click', () => {
    const newPass = newPasswordInput.value;
    const confirmPass = confirmNewPasswordInput.value;

    const passwordHelp = document.getElementById('passwordHelp');
    const confirmPasswordHelp = document.getElementById('confirmPasswordHelp');

    passwordHelp.classList.add('d-none');
    confirmPasswordHelp.classList.add('d-none');

    let valid = true;

    if (!validatePassword(newPass)) {
      passwordHelp.classList.remove('d-none');
      valid = false;
    }

    if (newPass !== confirmPass) {
      confirmPasswordHelp.classList.remove('d-none');
      valid = false;
    }

    if (!valid) return;

    Swal.fire({
      icon: 'success',
      title: 'Password Changed',
      text: 'Your password has been successfully changed.',
    }).then(() => {
      window.location.href = "user-login.html";
    });
  });
});
