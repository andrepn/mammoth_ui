import { Pool } from "./_pool";
import styles from "../../styles/Pool.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  approveToken,
  depositPool,
  getDepositERC20Amount,
  getTokeAllowance,
} from "../../services/pool.service";
import LoadingIndicator from "../../components/Indicator";
import { waitForTransaction } from "../../services/wallet.service";

const Deposit = () => {
  const [depositAmount, changeAmount] = useState(BigNumber.from("0"));
  const [LPAmount, changeLPAmount] = useState(BigNumber.from("0"));
  const [tokenIndex, changeIndex] = useState(0);
  const [isLoading, changeIsLoading] = useState(false);
  const [txComplete, changeTxComplete] = useState(false);
  const [isTokenApproved, changeTokenApproved] = useState(false);

  const tokenApproval = useCallback(async () => {
    const res: BigNumber = await getTokeAllowance(tokenIndex);
    if (res.isZero()) {
      changeTokenApproved(false);
    } else {
      changeTokenApproved(true);
    }
  }, [tokenIndex]);

  useEffect(() => {
    (async () => {
      await tokenApproval();
    })();
  });

  const displayValue =
    depositAmount.toString() === "0" ? "0" : depositAmount.toString();

  const handleInputChange = async (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    if (val.length > 0 && !BigNumber.from(val).eq(0)) {
      changeAmount(BigNumber.from(val));
      const amount = await getDepositERC20Amount(tokenIndex, val);
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
      const tx = await depositPool(depositAmount.toString(), tokenIndex);

      const completed = await waitForTransaction(tx.transaction_hash);
    } catch (e) {
      success = false;
      changeIsLoading(false);
    }
    changeIsLoading(false);
    if (success) {
      changeTxComplete(true);
      changeTokenApproved(true);
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
        <LoadingIndicator msg={"Awaiting Deposit"} isLoading={true} />
      ) : null}
      {txComplete ? (
        <LoadingIndicator
          closeable={true}
          msg={"Deposit Complete"}
          onClose={handleIndicatorClose}
        />
      ) : null}
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
        <button disabled={isTokenApproved} onClick={handleApprove}>
          Approve
        </button>
        <button disabled={isLoading || !isTokenApproved} onClick={handleSubmit}>
          Deposit
        </button>
      </div>
    </div>
  );
};

export default Deposit;
