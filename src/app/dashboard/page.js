import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Dashboard</h3>
                </div>
            </div>
        </>
    );
}