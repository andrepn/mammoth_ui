import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  approveToken,
  withdrawPool,
  getWithdrawERC20Amount,
  tokens,
} from "../../services/pool.service";
import LoadingIndicator from "../../components/Indicator";
import { waitForTransaction } from "../../services/wallet.service";

const Withdraw = () => {
  const [withdrawAmount, changeAmount] = useState(BigNumber.from("0"));
  const [LPAmount, changeLPAmount] = useState(BigNumber.from("0"));
  const [tokenIndex, changeIndex] = useState(0);
  const [isLoading, changeIsLoading] = useState(false);
  const [txComplete, changeTxComplete] = useState(false);

  const displayValue =
    withdrawAmount.toString() === "0" ? "0" : withdrawAmount.toString();

  const handleInputChange = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    if (val.length > 0 && !BigNumber.from(val).eq(0)) {
      changeAmount(BigNumber.from(val));
      const amount = await getWithdrawERC20Amount(tokenIndex, val);
      changeLPAmount(amount);
    } else {
      changeAmount(BigNumber.from("0"));
    }
  };

  const handleTokenSelect = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    //await tokenApproval();
    changeIndex(parseInt(val));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    changeIsLoading(true);
    let success = true;
    try {
      const tx = await withdrawPool(withdrawAmount.toString(), tokenIndex);

      const completed = await waitForTransaction(tx.transaction_hash);
    } catch (e) {
      success = false;
      changeIsLoading(false);
    }
    changeIsLoading(false);
    if (success) {
      changeTxComplete(true);
    }
  };

  const handleApprove = async (e: any) => {
    e.preventDefault();
    changeIsLoading(true);
    let success = true;
    try {
      const tx = await approveToken(tokenIndex);
      const completed = await waitForTransaction(tx.transaction_hash);
    } catch (e) {
      success = false;
      console.log(e);
    }
    if (success) changeIsLoading(false);
    changeTxComplete(true);
  };

  const handleIndicatorClose = () => {
    changeTxComplete(false);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingIndicator msg={"Awaiting Withdraw"} isLoading={true} />
      ) : null}
      {txComplete ? (
        <LoadingIndicator
          closeable={true}
          msg={"Withdraw Complete"}
          onClose={handleIndicatorClose}
        />
      ) : null}
      <Pool />
      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <div>
            <span className={styles.textspangrey}>LP Tokens</span>
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
      </div>

      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <span className={styles.textspan}>Receive</span>
          <select value={tokenIndex.toString()} onChange={handleTokenSelect}>
            <option value="0">FantieCoin</option>
            <option value="1">testUSDC</option>
            <option value="2">testETH</option>
          </select>

          <div className={styles.Receivebox} aria-label="Set increment amount">
            {LPAmount.toString()}
            <span className={styles.textspangrey}>
              {tokens[tokenIndex].symbol}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <button disabled={isLoading} onClick={handleSubmit}>
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
