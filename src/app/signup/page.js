import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Signup.module.css';

export default function SignUp() {
    return (
        <>
            <Navbar isUserAuthenticated={false} activeLink="" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics - Sign Up</h3>
                </div>
            </div>
        </>
    );
}