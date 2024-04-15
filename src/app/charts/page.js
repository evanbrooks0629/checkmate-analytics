"use client";
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Charts.module.css";
import { useEffect, useState } from "react";

export default function Charts() {

  useEffect(() => {setChart(handleChart(1))}, []);

  const [chart, setChart] = useState(null);
  
  //INSERT CHARTS IN CASE BELOW
  const handleChart = async (query) => {
    switch (query) {
      case 1:
        return <div className={styles.chartContent}>Chart 1</div>;
      case 2:
        return <div className={styles.chartContent}>Chart 2</div>;
      case 3:
        return <div className={styles.chartContent}>Chart 3</div>;
      case 4:
        return <div className={styles.chartContent}>Chart 4</div>;
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
