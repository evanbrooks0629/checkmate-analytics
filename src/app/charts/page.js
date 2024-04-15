"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Ensure this is correctly imported
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Charts.module.css";
import TimeControlChart from "@/components/TimeControl";
import MajorEventsPerformanceChart from "@/components/MajorEventsPerformanceChart";
import OpeningEvolutionChart from "@/components/OpeningEvolutionChart";
import OpeningWinRateChart from "@/components/OpeningWinRateChart";

export default function Charts() {
  
  const { push } = useRouter();
  const [authenticated, setAuthenticated] = useState(false);  // Default to false or null
  
  useEffect(() => {
    // This code now runs only on the client-side
    const auth = localStorage.getItem("authenticated") === 'true';
    setAuthenticated(auth);
    if (!auth) {
      push('/');
    }
  }, [push]);

  const [timeControl, setTimeControl] = useState([]);
  const [majorEvents, setMajorEvents] = useState([]);
  const [evolutionData, setEvolutionData] = useState([]); 
  const [winRate, setWinRate] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1234/api/time-control")
      .then((response) => response.json())
      .then((data) => setTimeControl(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:1234/api/major-events-performance")
      .then((response) => response.json())
      .then((data) => setMajorEvents(data))
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:1234/api/opening-evolution")
      .then((response) => response.json())
      .then((data) => setEvolutionData(data))
      .catch((error) => console.error("Error fetching data:", error));

      fetch("http://localhost:1234/api/opening-win-rate")
      .then((response) => response.json())
      .then((data) => setWinRate(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  

  const [chart, setChart] = useState(null);
  
  //INSERT CHARTS IN CASE BELOW
  const handleChart = async (query) => {
    switch (query) {
      case 1:
        return <div className={styles.chartContent}>
          <TimeControlChart data={timeControl} />
        </div>;
      case 2:
        return <div className={styles.chartContent}>
          <MajorEventsPerformanceChart data={majorEvents}/>
        </div>;
      case 3:
        return <div className={styles.chartContent}><OpeningEvolutionChart data={evolutionData}/></div>;
      case 4:
        return <div className={styles.chartContent}><OpeningWinRateChart data={winRate} /></div>;
      case 5:
        return <div className={styles.chartContent}>Chart 5</div>;
      case 6:
        return <div className={styles.chartContent}>Chart 6</div>;
    }
  };

  return (
    <>
      <Navbar isUserAuthenticated={true} activeLink="charts" />
      <div className={styles.Home}>
        <div className={styles.Content}>
          <h2>Select a Query Metric to View</h2>
          <div className={styles.btn_row}>
            <button onClick={() => setChart(handleChart(1))}>Query 1</button>
            <button onClick={() => setChart(handleChart(2))}>Query 2</button>
            <button onClick={() => setChart(handleChart(3))}>Query 3</button>
            <button onClick={() => setChart(handleChart(4))}>Query 4</button>
            <button onClick={() => setChart(handleChart(5))}>Query 5</button>
            <button onClick={() => setChart(handleChart(6))}>Query 6</button>
          </div>
          <div className={styles.chartContainer}>{chart}</div>
        </div>
      </div>
    </>
  );
}
