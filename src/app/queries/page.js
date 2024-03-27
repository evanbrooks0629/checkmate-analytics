import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Queries.module.css';

export default function Queries() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="queries" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Queries</h3>
                </div>
            </div>
        </>
    );
}