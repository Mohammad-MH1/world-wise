import styles from './Spinner.module.css';

// used anywhere related to making API requests, to show a spinner while waiting out data to get resolved
function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Spinner;
