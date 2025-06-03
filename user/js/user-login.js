document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");
    const toggleIcon = document.getElementById("togglePasswordIcon");

    const loginSection = document.getElementById("loginSection");
    const verificationSection = document.getElementById("verificationSection");
    const codeInputs = document.querySelectorAll(".code-input");
    const verifyBtn = document.getElementById("verifyCodeBtn");

    let matchedUser = null;
    let attemptCount = 0;
    const maxAttempts = 5;
    const lockoutMinutes = 5;

    let attemptsLeft = maxAttempts;
    let locked = false;

    emailjs.init("wzXgijBftES2PKfLj");

    toggleBtn.addEventListener("click", function () {
        const isPasswordHidden = passwordInput.type === "password";
        passwordInput.type = isPasswordHidden ? "text" : "password";
        toggleIcon.classList.toggle("bi-eye-slash", !isPasswordHidden);
        toggleIcon.classList.toggle("bi-eye", isPasswordHidden);
    });

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!validatePassword(password)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Password",
                text: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            });
            return;
        }

        const userLockoutEnd = localStorage.getItem(`lockoutEnd_${email}`);
        if (userLockoutEnd && Date.now() < parseInt(userLockoutEnd)) {
            const remaining = Math.ceil((parseInt(userLockoutEnd) - Date.now()) / 60000);
            Swal.fire("Account Locked", `Too many failed attempts. Try again in ${remaining} minute(s).`, "error");
            return;
        }

        const hashedInputPassword = await hashPassword(password); // hash the input

        fetch("../xml/user-login.xml")
            .then((res) => res.text())
            .then((xmlText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                const users = xmlDoc.getElementsByTagName("user");
                let isAuthenticated = false;
                let matchedUser = null;

                for (let user of users) {
                    const xmlEmail = user.getElementsByTagName("email")[0]?.textContent || user.getElementsByTagName("username")[0]?.textContent;
                    const xmlPassword = user.getElementsByTagName("password")[0]?.textContent;

                    if (email === xmlEmail && hashedInputPassword === xmlPassword) {
                        matchedUser = user;
                        isAuthenticated = true;
                        break;
                    }
                }

                if (isAuthenticated) {
                    attemptCount = 0;
                    attemptsLeft = maxAttempts;
                    locked = false;

                    const userEmail = matchedUser.getElementsByTagName("email")[0].textContent;
                    const verificationCode = generateRandomCode();

                    sendVerificationCode(userEmail, verificationCode)
                        .then(() => {
                            Swal.fire({
                                icon: "success",
                                title: "Login Successful",
                                text: "Please enter your verification code.",
                            }).then(() => {
                                loginSection.style.display = "none";
                                verificationSection.style.display = "flex";

                                codeInputs[0].focus();
                                codeInputs.forEach(input => (input.value = ''));
                            });
                        })
                        .catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Failed to send email',
                                text: 'Please try again later.',
                            });
                            console.error('EmailJS error:', error);
                        });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: "Invalid email or password.",
                    });
                }
            })
            .catch((err) => {
                console.error("Error loading XML:", err);
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "An error occurred while trying to log in.",
                });
            });
    });




    verifyBtn.addEventListener("click", function () {
        let inputCode = "";
        codeInputs.forEach(input => {
            inputCode += input.value.trim();
        });

        if (inputCode.length !== 6) {
            Swal.fire("Error", "Please enter the full 6-digit code.", "error");
            return;
        }

        const correctCode = localStorage.getItem("verificationCode");

        if (!correctCode) {
            Swal.fire("Error", "No verification code found for this session.", "error");
            return;
        }

        const email = matchedUser?.getElementsByTagName("email")[0]?.textContent;
        const lockoutEnd = localStorage.getItem(`lockoutEnd_${email}`);

        if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
            const remaining = Math.ceil((parseInt(lockoutEnd) - Date.now()) / 60000);
            Swal.fire("Account Locked", `Too many failed attempts. Try again in ${remaining} minute(s).`, "error");
            return;
        }

        if (inputCode === correctCode) {
            Swal.fire({
                icon: "success",
                title: "Verification Successful",
                text: "You have successfully verified your account.",
                confirmButtonText: "Continue",
            }).then(() => {
                window.location.href = "user-dashboard-empty.html";
            });
            attemptCount = 0;
            attemptsLeft = maxAttempts;
            locked = false;
            localStorage.removeItem(`lockoutEnd_${email}`);
        } else {
            attemptCount++;
            attemptsLeft--;
            if (attemptCount >= maxAttempts) {
                const lockoutTime = Date.now() + lockoutMinutes * 60000;
                localStorage.setItem(`lockoutEnd_${email}`, lockoutTime.toString());
                Swal.fire("Account Locked", `Too many failed attempts. Account locked for ${lockoutMinutes} minute(s).`, "error");
                verificationSection.style.display = "none";
                loginSection.style.display = "flex";
                codeInputs.forEach(input => input.value = "");
            } else {
                Swal.fire("Incorrect Code", `You have ${attemptsLeft} attempt(s) left.`, "warning");
            }
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

    function validatePassword(password) {
        const minLength = /.{8,}/;
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const number = /[0-9]/;
        const special = /[!@#$%^&*(),.?":{}|<>]/;

        return (
            minLength.test(password) &&
            upper.test(password) &&
            lower.test(password) &&
            number.test(password) &&
            special.test(password)
        );
    }

    function generateRandomCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem("verificationCode", code);
        return code;
    }

    function sendVerificationCode(userEmail, verificationCode) {
        const templateParams = {
            to_email: userEmail,
            verification_code: verificationCode,
        };

        return emailjs.send("service_l53qafo", "template_mzv1dvi", templateParams)
            .then(() => {
                console.log("Verification code sent via EmailJS");
            });
    }
});

