import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  approveToken,
  swapPool,
  getSwapAmount,
  tokens,
  getTokeAllowance,
} from "../../services/pool.service";
import LoadingIndicator from "../../components/Indicator";
import { waitForTransaction } from "../../services/wallet.service";

const Swap = () => {
  const [swapAmount, changeAmount] = useState(BigNumber.from("0"));
  const [LPAmount, changeLPAmount] = useState(BigNumber.from("0"));
  const [tokenInIndex, changeIndexIn] = useState(0);
  const [tokenOutIndex, changeIndexOut] = useState(1);
  const [isLoading, changeIsLoading] = useState(false);
  const [txComplete, changeTxComplete] = useState(false);
  const [isTokenApproved, changeTokenApproved] = useState(false);

  const displayValue =
    swapAmount.toString() === "0" ? "0" : swapAmount.toString();

  const tokenApproval = useCallback(async () => {
    const res: BigNumber = await getTokeAllowance(tokenInIndex);
    console.log(res);
    if (res.isZero()) {
      changeTokenApproved(false);
    } else {
      changeTokenApproved(true);
    }
  }, [tokenInIndex]);

  useEffect(() => {
    (async () => {
      await tokenApproval();
    })();
  });

  const handleInputChange = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    if (val.length > 0 && !BigNumber.from(val).eq(0)) {
      changeAmount(BigNumber.from(val));
      const amount = await getSwapAmount(tokenInIndex, tokenOutIndex, val);
      changeLPAmount(amount);
    } else {
      changeAmount(BigNumber.from("0"));
    }
  };

  const handleTokenInSelect = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    //await tokenApproval();

    const newTokenIn = parseInt(val);
    if (newTokenIn == tokenOutIndex) {
      const temp = tokenInIndex;
      changeIndexOut(temp);
      changeIndexIn(newTokenIn);
    } else {
      changeIndexIn(val);
    }
  };

  const handleTokenOutSelect = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    //await tokenApproval();

    const newTokenOut = parseInt(val);
    if (newTokenOut === tokenInIndex) {
      let temp = tokenOutIndex;
      changeIndexIn(temp);
      changeIndexOut(newTokenOut);
    } else {
      changeIndexOut(val);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    changeIsLoading(true);
    let success = true;
    try {
      const tx = await swapPool(
        swapAmount.toString(),
        tokenInIndex,
        tokenOutIndex
      );

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
      console.log(tokenInIndex);
      const tx = await approveToken(tokenInIndex);
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
        <LoadingIndicator msg={"Awaiting Swap"} isLoading={true} />
      ) : null}
      {txComplete ? (
        <LoadingIndicator
          closeable={true}
          msg={"Swap Complete"}
          onClose={handleIndicatorClose}
        />
      ) : null}
      <Pool />
      <div className={styles.row}>
        <div className={styles.transactionPart}>
          <select
            value={tokenInIndex.toString()}
            onChange={handleTokenInSelect}
          >
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
          <select
            value={tokenOutIndex.toString()}
            onChange={handleTokenOutSelect}
          >
            <option value="0">Token One</option>
            <option value="1">Token Two</option>
            <option value="2">Token Three</option>
          </select>

          <div className={styles.recievebox} aria-label="Set increment amount">
            {LPAmount.toString()}
            <span className={styles.textspangrey}>
              {tokens[tokenOutIndex].symbol}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <button disabled={isTokenApproved} onClick={handleApprove}>
          Approve
        </button>
        <button disabled={isLoading || !isTokenApproved} onClick={handleSubmit}>
          Swap
        </button>
      </div>
    </div>
  );
};

export default Swap;
