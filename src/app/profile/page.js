import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Profile.module.css';

export default function Profile() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Profile</h3>
                </div>
            </div>
        </>
    );
}