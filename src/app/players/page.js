import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Players.module.css';

export default function Players() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="players" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Players</h3>
                </div>
            </div>
        </>
    );
}