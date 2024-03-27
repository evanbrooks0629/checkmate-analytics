import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Charts.module.css';

export default function Charts() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="charts" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Charts</h3>
                </div>
            </div>
        </>
    );
}