import styles from './Login.module.css';

/**
 * Login component that triggers the manual OAuth flow.
 */
function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/login';
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Game Sales Analytics</h1>
        <p className={styles.subtitle}>
          Please sign in with GitHub to access the dashboard.
        </p>
        
        <button className={styles.githubButton} onClick={handleLogin}>
          <img 
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
            alt="GitHub Logo" 
            className={styles.icon}
          />
          Sign in with GitHub
        </button>

        <footer className={styles.footer}>
          Developed for Linnaeus University - 2026
        </footer>
      </div>
    </div>
  );
}

export default Login;