import { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register elements and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const OpeningWinRateChart = ({ data }) => {
  const { datasets, options } = useMemo(() => {
    // Ensure data is available and is an array
    if (!data || !Array.isArray(data)) {
      return { datasets: [] };
    }

    // Group data by year for multiple points per year
    const dataByYear = data.reduce((acc, item) => {
      const yearKey = item.YEAR.toString(); // Ensure year is a string for key
      acc[yearKey] = acc[yearKey] || [];
      acc[yearKey].push({
        x: parseFloat(item.WINRATE),
        y: parseFloat(item.GAMESPLAYED),
        ecoName: item.ECONAME,
        eco: item.ECO,
      });
      return acc;
    }, {});

    // Create datasets, one for each year, with colors and labels
    const datasets = Object.keys(dataByYear).map((year) => ({
      label: `Year ${year}`,
      data: dataByYear[year],
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    // Define chart options
    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.raw;
              return `${point.ecoName} (${point.eco}): Win Rate - ${point.x}%, Games - ${point.y}`;
            },
          },
        },
        title: {
          display: true,
          text: "Win Rates and Games Played of Popular Chess Openings by Year",
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Win Rate (%)",
          },
        },
        y: {
          type: "linear",
          title: {
            display: true,
            text: "Games Played",
          },
          beginAtZero: true,
        },
      },
    };

    return { datasets, options };
  }, [data]);

  return <Scatter options={options} data={{ datasets }} />;
};

export default OpeningWinRateChart;
