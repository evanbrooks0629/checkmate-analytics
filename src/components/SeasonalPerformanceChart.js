import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register elements and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const SeasonalPerformanceChart = ({ data }) => {
    const { chartData, options } = useMemo(() => {
      // Initialize structure for chart data
      const chartData = {
        labels: [], // This will hold unique years
        datasets: []
      };
  
      // Define colors for each season
      const seasonColors = {
        Winter: "rgba(54, 162, 235, 0.6)",
        Spring: "rgba(75, 192, 192, 0.6)",
        Summer: "rgba(255, 206, 86, 0.6)",
        Autumn: "rgba(255, 99, 132, 0.6)"
      };
  
      // Initialize datasets array with one dataset per season
      const seasons = ["Winter", "Spring", "Summer", "Autumn"];
      seasons.forEach(season => {
        chartData.datasets.push({
          label: season,
          data: [],
          backgroundColor: seasonColors[season],
          borderColor: seasonColors[season],
          borderWidth: 1
        });
      });
  
      // Populate the datasets
      data.forEach(item => {
        const yearIndex = chartData.labels.indexOf(item.YEAR);
        if (yearIndex === -1) {
          // New year, add to labels and ensure each dataset has a slot
          chartData.labels.push(item.YEAR);
          chartData.datasets.forEach(dataset => {
            dataset.data.push(0); // Initialize with 0
          });
        }
        const updateIndex = chartData.labels.indexOf(item.YEAR);
        const seasonDataset = chartData.datasets.find(d => d.label === item.SEASON);
        if (seasonDataset) {
          seasonDataset.data[updateIndex] = item.WINPERCENTAGE;
        }
      });
  
      // Define options for the bar chart
      const options = {
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
            text: 'Seasonal Win Percentage Over Years'
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year'
            },
          },
          y: {
            title: {
              display: true,
              text: 'Win Percentage (%)'
            },
            beginAtZero: true
          }
        }
      };
  
      return { chartData, options };
    }, [data]);
  
    return <Bar options={options} data={chartData} />;
  };
  
  export default SeasonalPerformanceChart;
  