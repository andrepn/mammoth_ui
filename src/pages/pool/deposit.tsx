import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";
import React, { useState } from "react";
import { BigNumber } from "ethers";
import { getDepositERC20Amount } from "../../services/pool.service";

const Deposit = () => {
  const [depositAmount, changeAmount] = useState(BigNumber.from("0"));
  const [LPAmount, changeLPAmount] = useState(BigNumber.from("0"));
  const [tokenIndex, changeIndex] = useState(0);

  const displayValue =
    depositAmount.toString() === "0" ? "0" : depositAmount.toString();

  const handleInputChange = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    const amount = getDepositERC20Amount(tokenIndex, val);
    changeLPAmount(BigNumber.from(amount));
    if (val.length) {
      changeAmount(BigNumber.from(val));
    } else {
      changeAmount(BigNumber.from("0"));
    }
  };

  const handleTokenSelect = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    changeIndex(parseInt(val));
  };

  return (
    <div>
      <Pool />
      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <select value={tokenIndex.toString()} onChange={handleTokenSelect}>
            <option value="0">Token One</option>
            <option value="1">Token Two</option>
            <option value="2">Token Three</option>
          </select>
          <input
            onChange={handleInputChange}
            className={styles.textbox}
            name="amount"
            aria-label="Set increment amount"
            value={displayValue}
            type="number"
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
              {LPAmount.toString()}
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
