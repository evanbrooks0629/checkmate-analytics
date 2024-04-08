import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Queries.module.css';

export default function Queries() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.mainDiv}>
                <div className={styles.create}>
                    <div className={styles.queryHeader}>
                        Select a query
                    </div>
                    <div className={styles.gridLayout}>
                        <span className={styles.queries}>Query 1</span>
                        <span className={styles.queries}>Query 2</span>
                        <span className={styles.queries}>Query 3</span>
                        <span className={styles.queries}>Query 4</span>
                        <span className={styles.queries}>Query 5</span>
                        <span className={styles.queries}>Query 6</span>
                    </div>
                </div>
                <div className={styles.results}>

                </div>
            </div>
        </>
    );
}