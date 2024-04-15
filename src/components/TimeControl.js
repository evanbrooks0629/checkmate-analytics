import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimeControlChart = ({ data }) => {
  const { chartData, chartOptions } = useMemo(() => {
    // Aggregate ELO brackets into ranges
    const eloBracketRanges = {
      '200-2299': [],
      '2300-2599': [],
      '2600-2899': [],
      '2900-3200': []
    };

    // Aggregate data into the defined Elo bracket ranges
    data.forEach(item => {
      const bracket = item.ELOBRACKET;
      if (bracket >= 200 && bracket < 2300) eloBracketRanges['200-2299'].push(item);
      else if (bracket >= 2300 && bracket < 2600) eloBracketRanges['2300-2599'].push(item);
      else if (bracket >= 2600 && bracket < 2900) eloBracketRanges['2600-2899'].push(item);
      else if (bracket >= 2900 && bracket <= 3200) eloBracketRanges['2900-3200'].push(item);
    });

    const timeControls = [...new Set(data.map(item => item.TIMECONTROL))];

    const datasets = timeControls.map((control, index) => ({
      label: control,
      data: Object.values(eloBracketRanges).map(bracket => {
        return bracket.reduce((sum, item) => {
          return item.TIMECONTROL === control ? sum + item.GAMECOUNT : sum;
        }, 0);
      }),
      backgroundColor: `hsla(${360 * index / timeControls.length}, 70%, 70%, 0.75)`
    }));

    return {
      chartData: {
        labels: Object.keys(eloBracketRanges),
        datasets
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
            text: 'Time Control Preferences by Player Rating'
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Elo Bracket Range'
            },
            stacked: true,
          },
          y: {
            title: {
              display: true,
              text: 'Game Count'
            },
            stacked: true
          }
        }
      }
    };
  }, [data]);

  return <Bar options={chartOptions} data={chartData} />;
};

export default TimeControlChart;
