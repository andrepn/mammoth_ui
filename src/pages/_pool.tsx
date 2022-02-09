import React, { useEffect, useState } from "react";
import { getPoolBalances } from "../services/fake-token.service";

import styles from "../styles/Pool.module.css";

export const Pool = () => {
  const [poolbalances, changeBalances] = useState([0, 0, 0]);

  useEffect(() => {
    (async () => {
      const res = await getPoolBalances();
      changeBalances(res);
    })();
  }, [poolbalances]);

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
            Token One : <b>{poolbalances[0]}</b>
          </div>
          <div className={styles.row}>
            Token Two : <b>{poolbalances[1]}</b>
          </div>
          <div className={styles.row}>
            Token Two : <b>{poolbalances[3]}</b>
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
