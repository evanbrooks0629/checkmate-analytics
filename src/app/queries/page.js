import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Queries.module.css';

export default function Queries() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.mainDiv}>
                <div className={styles.create}>
                    
                </div>
                <div className={styles.results}>
                
                </div>
            </div>
        </>
    );
}