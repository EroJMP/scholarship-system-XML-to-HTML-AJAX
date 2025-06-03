let verificationCode = "";
let userPermission = "";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const enteredUsername = document.getElementById("username").value.trim();
  const enteredPassword = document.getElementById("password").value.trim();

  if (!enteredUsername || !enteredPassword) {
    Swal.fire("Error", "Please enter both username and password.", "error");
    return;
  }

  const lockData = JSON.parse(localStorage.getItem(`lock_${enteredUsername}`));
  if (lockData) {
    const now = new Date().getTime();
    if (now < lockData.lockUntil) {
      const minutesLeft = Math.ceil((lockData.lockUntil - now) / 60000);
      Swal.fire("Account Locked", `Too many failed attempts. Try again in ${minutesLeft} minute(s).`, "error");
      return;
    } else {
      localStorage.removeItem(`lock_${enteredUsername}`);
    }
  }

  const hashedEnteredPassword = await hashPassword(enteredPassword);

  try {
    const response = await fetch("../xml/login.xml");
    const data = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");
    const users = xml.getElementsByTagName("user");
    let found = false;
    let email = "";

    for (let user of users) {
      const username = user.getElementsByTagName("username")[0].textContent;
      const password = user.getElementsByTagName("password")[0].textContent;

      if (enteredUsername === username && hashedEnteredPassword === password) {
        found = true;
        email = username;
        userPermission = user.getElementsByTagName("permission")[0].textContent;
        break;
      }
    }

    if (!found) {
      const maxAttempts = 3;
      const attemptsKey = `attempts_${enteredUsername}`;
      let attempts = parseInt(localStorage.getItem(attemptsKey)) || 0;
      attempts += 1;
      localStorage.setItem(attemptsKey, attempts);

      if (attempts >= maxAttempts) {
        const lockUntil = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem(`lock_${enteredUsername}`, JSON.stringify({ lockUntil }));
        localStorage.removeItem(attemptsKey);
        Swal.fire("Account Locked", "Too many failed attempts. Account locked for 30 minutes.", "error");
      } else {
        Swal.fire("Invalid", `Username or password is incorrect. Attempt ${attempts}/${maxAttempts}.`, "error");
      }
      return;
    }

    localStorage.removeItem(`attempts_${enteredUsername}`);

    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await emailjs.send("service_l53qafo", "template_mzv1dvi", {
      to_email: email,
      verification_code: verificationCode,
    });

    Swal.fire("Code Sent", "A verification code has been sent to your email.", "info");
    document.querySelector(".login-form").classList.add("d-none");
    document.getElementById("verificationSection").classList.remove("d-none");

  } catch (err) {
    console.error("Login error:", err);
    Swal.fire("Error", "Failed to process login. Please try again later.", "error");
  }
});



document.getElementById("verifyCodeBtn").addEventListener("click", function () {
    const codeInputs = document.querySelectorAll("#codeInputs input");
    let enteredCode = "";

    codeInputs.forEach(input => {
        enteredCode += input.value.trim();
    });

    if (enteredCode.length !== 6 || isNaN(enteredCode)) {
        Swal.fire("Invalid", "Please enter the full 6-digit code.", "error");
        return;
    }

    const lockKey = `verifLock_${document.getElementById("username").value}`;
    const attemptKey = `verifAttempts_${document.getElementById("username").value}`;
    const lockData = JSON.parse(localStorage.getItem(lockKey));

    const now = new Date().getTime();
    if (lockData && now < lockData.lockUntil) {
        const minutesLeft = Math.ceil((lockData.lockUntil - now) / 60000);
        Swal.fire("Locked", `Too many incorrect attempts. Try again in ${minutesLeft} minute(s).`, "error");
        return;
    }

    if (enteredCode === verificationCode) {
        localStorage.removeItem(attemptKey);
        localStorage.removeItem(lockKey);

        Swal.fire("Verified", "Code verified successfully!", "success").then(() => {
            if (userPermission === "admin") {
                window.location.href = "../../admin/pages/dashboard.html";
            } else if (userPermission === "staff") {
                window.location.href = "../../staff/pages/dashboard.html";
            } else {
                Swal.fire("Error", "Unrecognized permission level.", "error");
            }
        });
    } else {
        let attempts = parseInt(localStorage.getItem(attemptKey)) || 0;
        attempts += 1;
        localStorage.setItem(attemptKey, attempts);

        const maxAttempts = 3;
        if (attempts >= maxAttempts) {
            const lockUntil = new Date().getTime() + 30 * 60 * 1000;
            localStorage.setItem(lockKey, JSON.stringify({ lockUntil }));
            localStorage.removeItem(attemptKey);
            Swal.fire("Locked", "Too many incorrect codes. Verification locked for 30 minutes.", "error");
        } else {
            Swal.fire("Incorrect", `The verification code is incorrect. Attempt ${attempts}/${maxAttempts}.`, "error");
        }
    }
});


document.querySelectorAll('#codeInputs input').forEach((input, index, inputs) => {
  input.addEventListener('input', () => {
    if (input.value.length === input.maxLength) {
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value.length === 0) {
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  });
});


function togglePasswordVisibility(passwordFieldId, checkboxId) {
  const passwordInput = document.getElementById(passwordFieldId);
  const checkbox = document.getElementById(checkboxId);
  passwordInput.type = checkbox.checked ? "text" : "password";
}
