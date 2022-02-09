import React from "react";

import styles from "../styles/Pool.module.css";

export const Pool = () => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.infoContainer}>
          <h4>Your Balance</h4>
          <div className={styles.row}>
            LP Token : <b>100</b>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <h4>Pool Balance</h4>
          <div className={styles.row}>
            Token One : <b>100</b>
          </div>
          <div className={styles.row}>
            Token Two : <b>50</b>
          </div>
          <div className={styles.row}>
            Token Two : <b>250</b>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <button className={styles.tab}>Deposit</button>
        <button className={styles.tab}>Withdraw</button>
        <button className={styles.tab}>Swap</button>
      </div>
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
        <button className={styles.button}>Deposit</button>
      </div>
    </div>
  );
};
