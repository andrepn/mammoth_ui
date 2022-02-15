import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";

const Withdraw = () => {
  return (
    <div>
      <Pool />
      <div className={styles.row}>
        Input
        <input
          className={styles.textbox}
          name="amount"
          aria-label="Set increment amount"
          value={100}
        />
        Token One for
        <input
          className={styles.textbox}
          name="amount"
          aria-label="Set increment amount"
          value={50}
        />
        LP Tokens
        <button className={styles.button}>Withdraw</button>
      </div>
    </div>
  );
};

export default Withdraw;
