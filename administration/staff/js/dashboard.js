
Swal.fire({
    toast: true,
    position: 'bottom-end',
    icon: 'success',
    title: '<strong>Successful login<strong>',
    text: 'You logged in as a admin',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
    popup: 'colored-toast'
    }
  });
  document.addEventListener('DOMContentLoaded', function () {
    const statusPieCtx = document.getElementById('statusPieChart').getContext('2d');
    new Chart(statusPieCtx, {
      type: 'pie',
      data: {
        labels: ['Application', 'Pending'],
        datasets: [{
          data: [70, 30],
          backgroundColor: ['#1E42B5', '#FFCC00'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true
            }
          }
        }
      }      
    });

    const interviewPieCtx = document.getElementById('interviewPieChart').getContext('2d');
    new Chart(interviewPieCtx, {
      type: 'pie',
      data: {
        labels: ['Approved', 'Rejected'],
        datasets: [{
          data: [70, 30],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true
            }
          }
        }
      }     
    });
  
    const applicantChartCtx = document.getElementById('applicantStatisticsChart').getContext('2d');
    new Chart(applicantChartCtx, {
      type: 'bar',
      data: {
        labels: ['Academic..', 'Private Sc..', 'Sports Scholar..', 'Financial..', 'Incentive..', 'Sanggunian..', 'Out-of-School..', 'CHIP-in..'],
        datasets: [{
          label: 'Applicants',
          data: [890, 120 ,20, 34, 50, 18, 12, 340],
          backgroundColor: '#3F51B5',
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  });
  