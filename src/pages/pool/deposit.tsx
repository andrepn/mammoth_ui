import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";

const Deposit = () => {
  return (
    <div>
      <Pool />
      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <select>
            <option value="0">Token One</option>
            <option value="1">Token Two</option>
            <option value="2">Token Three</option>
          </select>
          <input
            className={styles.textbox}
            name="amount"
            aria-label="Set increment amount"
            value={"0.0"}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <span className={styles.textspan}>Recieve</span>
          <div>
            <div
              className={styles.recievebox}
              aria-label="Set increment amount"
            >
              50
              <span className={styles.textspangrey}>LP Tokens</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <button className={""}>Deposit</button>
      </div>
    </div>
  );
};

export default Deposit;
