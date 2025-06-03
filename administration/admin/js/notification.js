$(document).ready(function () {
  $('#notifBell').on('click', function (e) {
    e.stopPropagation();
    $('#notifDropdown').toggleClass('d-none');
  });

  $(document).on('click', function () {
    $('#notifDropdown').addClass('d-none');
  });
});