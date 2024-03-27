import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Login.module.css';

export default function LogIn() {

    async function onSubmit(event) {
        event.preventDefault()
     
        const formData = new FormData(event.currentTarget)
        // const response = await fetch('/api/submit', {
        //   method: 'POST',
        //   body: formData,
        // })
     
        // // Handle response if necessary
        // const data = await response.json()
        // // ...
        console.log(formData)
      }

    return (
        <>
            <Navbar isUserAuthenticated={false} activeLink="" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <h3 className={styles.h3}>Log In</h3>
                    <form onSubmit={onSubmit}>
                        <input type="text" name="username" />
                        <input type="password" name="password" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}