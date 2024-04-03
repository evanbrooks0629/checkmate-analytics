import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Players.module.css';

export default function Players() {
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.mainDiv}>
                <div className={styles.searchBarDiv}>
                    <div className={styles.searchBox}>
                        <span>Search for player</span>
                        <div className={styles.boxAndButton}>
                            <input className={styles.input} type="Search" name="Search" />
                            <button className={styles.searchBtn} type="submit">Search</button>
                        </div>
                    </div>
                </div>
                <div className={styles.resultDiv}>
                    <div className={styles.playerName}>
                        Hikaru Nakamura
                    </div>
                    <div className={styles.border} />

                    <div className={styles.stats}>

                    </div>
                </div>
            </div>
        </>
    );
}