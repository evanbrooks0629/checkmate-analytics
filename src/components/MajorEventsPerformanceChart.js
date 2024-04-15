import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MajorEventsPerformanceChart = ({ data }) => {
  const { chartData, chartOptions } = useMemo(() => {
    const datasets = [{
      label: 'Number of Players',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: data.map(item => item.NUMBEROFPLAYERS)
    }, {
      label: 'Average Accuracy',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: data.map(item => item.AVG_ACCURACY)
    }];

    const labels = data.map(item => item.YEAR);

    return {
      chartData: {
        labels: labels,
        datasets: datasets
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          title: {
            display: true,
            text: 'Yearly Performance Metrics by Top Quartile Players'
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    };
  }, [data]);

  return <Bar options={chartOptions} data={chartData} />;
};

export default MajorEventsPerformanceChart;
