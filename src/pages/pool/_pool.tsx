import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  getLiquidityBalances,
  getPoolBalances,
} from "../../services/pool.service";

import styles from "../../styles/Pool.module.css";
import Header from "../_header";

export const Pool = () => {
  const [poolbalances, changeBalances] = useState([0, 0, 0]);
  const [liquidityBalance, changeLiquidityBalance] = useState(1);
  useEffect(() => {
    (async () => {
      const res = await getPoolBalances();
      changeBalances(res);
    })();

    (async () => {
      const res = await getLiquidityBalances();
      changeLiquidityBalance(res);
    })();
  }, [poolbalances]);

  const path = window.location.pathname.split("/")[2];
  const depositHeaderClasses = [path == "deposit" ? styles.activetab : ""];
  const withdrawHeaderClasses = [path == "withdraw" ? styles.activetab : ""];
  const swapHeaderClasses = [path == "swap" ? styles.activetab : ""];
  return (
    <div>
      <Header />
      <div className={styles.row}>
        <div className={styles.infoContainer}>
          <h4>Your Balance</h4>
          <div className={styles.row}>
            LP Token : <b>{liquidityBalance}</b>
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
            Token Three : <b>{poolbalances[2]}</b>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <table id="navigation options">
          <tr>
            <th className={depositHeaderClasses.join(" ")}>
              <Link href={`/pool/deposit`} passHref={true}>
                Deposit
              </Link>
            </th>
            <th className={withdrawHeaderClasses.join(" ")}>
              <Link href={`/pool/withdraw`} passHref={true}>
                Withdraw
              </Link>
            </th>
            <th className={swapHeaderClasses.join(" ")}>
              <Link href={`/pool/swap`} passHref={true}>
                Swap
              </Link>
            </th>
          </tr>
        </table>
      </div>
    </div>
  );
};
