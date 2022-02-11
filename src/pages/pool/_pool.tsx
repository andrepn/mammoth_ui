import { BigNumber } from "ethers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  getLiquidityBalances,
  getPoolBalances,
  mintToken,
  tokens,
} from "../../services/pool.service";

import styles from "../../styles/Pool.module.css";

export const Pool = () => {
  const [poolbalances, changeBalances] = useState([
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
  ]);

  const [liquidityBalance, changeLiquidityBalance] = useState(
    BigNumber.from(0)
  );

  useEffect(() => {
    (async () => {
      const res = await getPoolBalances();
      console.log(res);
      changeBalances(res);
    })();

    (async () => {
      const res = await getLiquidityBalances();
      changeLiquidityBalance(res);
    })();
  }, []);

  const handleMint = async (tokenIndex: number) => {
    await mintToken(tokenIndex);
  };
  const path = window.location.pathname.split("/")[2];
  const depositHeaderClasses = [path == "deposit" ? styles.activetab : ""];
  const withdrawHeaderClasses = [path == "withdraw" ? styles.activetab : ""];
  const swapHeaderClasses = [path == "swap" ? styles.activetab : ""];
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.infoContainer}>
          <div className={styles.row}>
            <h4>Your Balance</h4>
          </div>
          <div className={styles.row}>
            LP Token : <b>{liquidityBalance.toString()}</b>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.row}>
            <h4>Pool Balance</h4>
          </div>
          <div className={styles.row}>
            {tokens[0].name} : <b>{poolbalances[0].toString()}</b>{" "}
            <button className={styles.smallbtn} onClick={() => handleMint(0)}>
              Mint
            </button>
          </div>
          <div className={styles.row}>
            {tokens[1].name} : <b>{poolbalances[1].toString()}</b>{" "}
            <button className={styles.smallbtn} onClick={() => handleMint(1)}>
              Mint
            </button>
          </div>
          <div className={styles.row}>
            {tokens[2].name} : <b>{poolbalances[2].toString()}</b>{" "}
            <button className={styles.smallbtn} onClick={() => handleMint(2)}>
              Mint
            </button>
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
