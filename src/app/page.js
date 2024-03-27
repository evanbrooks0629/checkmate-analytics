import './globals.css'
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from './Home.module.css';
import image from '../../public/images/Horse.png'

export default function Home() {
    return (
        <>
            <Navbar isUserAuthenticated={false} activeLink="dashboard" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Checkmate Analytics</h3>
                    <Image 
                        src={image}
                        width={250}
                        height={290}
                        alt="Logo"
                        className={styles.image}
                    />
                    <div className={styles.buttonBox}>
                        <a href="/login" className={styles.login}>Log In</a>
                        <a href="/signup" className={styles.signup}>Sign Up</a>
                    </div>
                </div>
            </div>
        </>
    );
}