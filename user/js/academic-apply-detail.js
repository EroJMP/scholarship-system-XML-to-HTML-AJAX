$(document).ready(function () {
  $(".toggle-edit").on("click", function () {
    const input = $(this).siblings("input");
    const isDisabled = input.prop("disabled");

    if (isDisabled) {
      input.prop("disabled", false).focus();
      $(this)
        .removeClass("btn-outline-primary")
        .addClass("btn-success")
        .html('<i class="bi bi-check"></i>');
    } else {
      input.prop("disabled", true);
      $(this)
        .removeClass("btn-success")
        .addClass("btn-outline-primary")
        .html('<i class="bi bi-pencil"></i>');
    }
  });
});


document.querySelectorAll('.toggle-edit').forEach(button => {
  button.addEventListener('click', () => {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input');
    const isDisabled = inputs[0].disabled;

    inputs.forEach(input => {
      input.disabled = !isDisabled;
    });

    const icon = button.querySelector('i');
    if (isDisabled) {
      icon.classList.remove('bi-pencil');
      icon.classList.add('bi-check');
      button.classList.remove('btn-outline-primary');
      button.classList.add('btn-success');
    } else {
      icon.classList.remove('bi-check');
      icon.classList.add('bi-pencil');
      button.classList.remove('btn-success');
      button.classList.add('btn-outline-primary');
    }
  });
});

document.getElementById("submitButton").addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to submit and continue?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, submit it!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "user-dashboard.html";
    }
  });
});

const buttons = document.querySelectorAll('.open-file-btn');
const inputs = document.querySelectorAll('.hidden-file-input');

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        inputs[index].click();
    });

    inputs[index].addEventListener('change', function () {
        if (this.files.length > 0) {
            alert("Selected file: " + this.files[0].name);
        }
    });
});