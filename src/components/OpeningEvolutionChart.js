import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register elements and scales
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const OpeningEvolutionChart = ({ data }) => {
    const { chartData, chartOptions } = useMemo(() => {
        // Extract unique years
        const years = [...new Set(data.map(item => item.YEAR))].sort();

        // Group by ECO and sum TOTALGAMES
        const ecoGameTotals = data.reduce((acc, item) => {
            acc[item.ECO] = (acc[item.ECO] || 0) + item.TOTALGAMES;
            return acc;
        }, {});

        // Create an array from the totals, sort by total games, and pick top 20
        const top20ECOs = Object.entries(ecoGameTotals)
            .sort((a, b) => b[1] - a[1])  // Sort by total games descending
            .slice(0, 20)  // Take the top 20
            .map(item => item[0]);  // Extract just the ECO codes

        // Create datasets for only the top 20 ECO codes
        const datasets = top20ECOs.map(eco => {
            return {
                label: eco,
                data: years.map(year => {
                    const item = data.find(d => d.YEAR === year && d.ECO === eco);
                    return item ? item.TOTALGAMES : 0;  // Return 0 if no data for that year
                }),
                fill: false,
                borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                tension: 0.1
            };
        });

        return {
            chartData: {
                labels: years,  // Years are now the labels for the x-axis
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
                        text: 'Chess Openings Evolution by Year (Top 20 ECOs)'
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
                            text: 'Total Games'
                        }
                    }
                }
            }
        };
    }, [data]);

    return <Line options={chartOptions} data={chartData} />;
};

export default OpeningEvolutionChart;
