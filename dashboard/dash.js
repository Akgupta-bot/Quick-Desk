document.addEventListener('DOMContentLoaded', function() {
  // Initialize all charts with animations disabled
  initStaticCharts();
  
  // Setup event listeners
  document.getElementById('time-period').addEventListener('change', function() {
    updateStaticCharts(this.value);
  });
});

function initStaticCharts() {
  // Chart data and labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const categories = ['Technical', 'Billing', 'General', 'Features'];
  const agents = ['Sarah K.', 'Mike T.', 'Alex J.', 'Jamie L.', 'Taylor M.'];
  
  // Tickets Over Time Chart (no animation)
  const ticketsOverTimeCtx = document.getElementById('ticketsOverTimeChart').getContext('2d');
  const ticketsOverTimeChart = new Chart(ticketsOverTimeCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Created',
          data: [18, 22, 25, 19, 27, 32, 28],
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Resolved',
          data: [12, 15, 18, 14, 22, 25, 24],
          borderColor: '#4cc9f0',
          backgroundColor: 'rgba(76, 201, 240, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: getStaticLineChartOptions('Tickets')
  });

  // Tickets by Category Chart (no animation)
  const ticketsByCategoryCtx = document.getElementById('ticketsByCategoryChart').getContext('2d');
  const ticketsByCategoryChart = new Chart(ticketsByCategoryCtx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: [42, 18, 25, 15],
        backgroundColor: [
          '#4361ee',
          '#f72585',
          '#4cc9f0',
          '#f8961e'
        ],
        borderWidth: 0
      }]
    },
    options: getStaticDoughnutOptions()
  });

  // Resolution Time Chart (no animation)
  const resolutionTimeCtx = document.getElementById('resolutionTimeChart').getContext('2d');
  const resolutionTimeChart = new Chart(resolutionTimeCtx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Hours',
        data: [18, 8, 12, 36],
        backgroundColor: [
          'rgba(67, 97, 238, 0.8)',
          'rgba(247, 37, 133, 0.8)',
          'rgba(76, 201, 240, 0.8)',
          'rgba(248, 150, 30, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: getStaticBarChartOptions('Hours')
  });

  // Agent Performance Chart (no animation)
  const agentPerformanceCtx = document.getElementById('agentPerformanceChart').getContext('2d');
  const agentPerformanceChart = new Chart(agentPerformanceCtx, {
    type: 'bar',
    data: {
      labels: agents,
      datasets: [{
        label: 'Tickets Closed',
        data: [38, 32, 25, 18, 12],
        backgroundColor: 'rgba(58, 12, 163, 0.8)',
        borderWidth: 0
      }]
    },
    options: getStaticBarChartOptions('Tickets')
  });

  // Store charts
  window.dashboardCharts = {
    ticketsOverTime: ticketsOverTimeChart,
    ticketsByCategory: ticketsByCategoryChart,
    resolutionTime: resolutionTimeChart,
    agentPerformance: agentPerformanceChart
  };
}

function updateStaticCharts(days) {
  const charts = window.dashboardCharts;
  if (!charts) return;

  // Update data without animations
  Chart.defaults.animation = false;
  
  // Update Tickets Over Time
  charts.ticketsOverTime.data.datasets[0].data = [15, 20, 23, 17, 25, 30, 26];
  charts.ticketsOverTime.data.datasets[1].data = [10, 13, 16, 12, 20, 23, 22];
  charts.ticketsOverTime.update();

  // Update Tickets by Category
  charts.ticketsByCategory.data.datasets[0].data = [38, 15, 22, 12];
  charts.ticketsByCategory.update();

  // Update Resolution Time
  charts.resolutionTime.data.datasets[0].data = [16, 7, 11, 32];
  charts.resolutionTime.update();

  // Update Agent Performance
  charts.agentPerformance.data.datasets[0].data = [35, 30, 23, 16, 10];
  charts.agentPerformance.update();
}

// Static Chart Options (no animations)
function getStaticLineChartOptions(yAxisTitle) {
  return {
    responsive: true,
    animation: {
      duration: 0 // Disable animations
    },
    hover: {
      animationDuration: 0 // Disable hover animations
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisTitle
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };
}

function getStaticDoughnutOptions() {
  return {
    responsive: true,
    animation: {
      duration: 0 // Disable animations
    },
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
}

function getStaticBarChartOptions(yAxisTitle) {
  return {
    responsive: true,
    animation: {
      duration: 0 // Disable animations
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisTitle
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };
}