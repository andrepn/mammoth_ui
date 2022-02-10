import { getStarknet } from "@argent/get-starknet";
import { compileCalldata, number, stark, uint256 } from "starknet";
import { utils } from "ethers";

const tokenOne = {
  address: "0x05e3dbd111ae4b27cdc8e8ac03fc0cd45d6873f109979c9461f03df7d805901a",
  name: "testUSDC",
  symbol: "TUSDC",
};

const tokenTwo = {
  address: "0x05b8094b3a64e727a6d1a24ee368929bc76b3611b5b50491bfb76ae60411825d",
  name: "FantieCoin",
  symbol: "FC",
};

const tokenThree = {
  address: "0x0723c4d60564756107a2f5aa405c20288fad6951c652f57ed5ccbaa6da17badc",
  name: "testETH",
  symbol: "TEETH",
};

export const tokens = [tokenOne, tokenTwo, tokenThree];

const liquidityTokenAddress =
  "0x024ab0a192c95cba8afcbed9951009a816b48c4835dfa4070e4c3878432dd708";
const poolAddress =
  "0x06a375089b7d770df6d92c2aa6c45bc4c2051da9070f261bec577d04a67414cf";

const proxyAddress =
  "0x0496ac0b1dd0bcec538f696cd171623bfb5557142bacf38f1a7c4e151cd40651";

const mintSelector = stark.getSelectorFromName("mint");

const balanceOfSelecter = stark.getSelectorFromName("balanceOf");

const swapAmountSelector = stark.getSelectorFromName("view_out_given_in");

const depositAmountSelector = stark.getSelectorFromName(
  "view_pool_minted_given_single_in"
);

const withdrawAmountSelector = stark.getSelectorFromName(
  "view_single_out_given_pool_in"
);

const depositSelector = stark.getSelectorFromName("mammoth_deposit");

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: "struct" as const, ...uint256.bnToUint256(bn) };
}

export const mintToken = async (tokenIndex: number): Promise<any> => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  return await starknet.signer.invokeFunction(
    tokens[tokenIndex].address,
    mintSelector,
    compileCalldata({
      receiver: number.toBN(activeAccount).toString(), //receiver (self)
      amount: getUint256CalldataFromBN(utils.parseUnits("10", 18).toString()), // amount
    })
  );
};

export const depositPool = async (
  amount: string,
  tokenIndex: number
): Promise<any> => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  return await starknet.signer.invokeFunction(
    proxyAddress,
    depositSelector,
    compileCalldata({
      user_address: number.toBN(activeAccount).toString(), //receiver (self)
      amount: getUint256CalldataFromBN(utils.parseUnits("10", 18).toString()), // amount
    })
  );
};

export const getPoolBalances = async (): Promise<any> => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  const tokenOneBalance = starknet.provider.callContract({
    contract_address: tokens[0].address,
    entry_point_selector: balanceOfSelecter,
    calldata: compileCalldata({
      account: number.toBN(poolAddress).toString(), //receiver (self)
    }),
  });

  const tokenTwoBalance = starknet.provider.callContract({
    contract_address: tokens[1].address,
    entry_point_selector: balanceOfSelecter,
    calldata: compileCalldata({
      account: number.toBN(poolAddress).toString(), //receiver (self)
    }),
  });

  const tokenThreeBalance = starknet.provider.callContract({
    contract_address: tokens[2].address,
    entry_point_selector: balanceOfSelecter,
    calldata: compileCalldata({
      account: number.toBN(poolAddress).toString(), //receiver (self)
    }),
  });

  const balances = await Promise.all([
    tokenOneBalance,
    tokenTwoBalance,
    tokenThreeBalance,
  ]);
  console.log(balances);
  return balances.map((balance) => {
    return uint256.uint256ToBN({
      low: balance.result[1],
      high: balance.result[0],
    });
  });
};

export const getLiquidityBalances = async (): Promise<any> => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  const liquidityBalance = await starknet.provider.callContract({
    contract_address: liquidityTokenAddress,
    entry_point_selector: balanceOfSelecter,
    calldata: compileCalldata({
      account: number.toBN(activeAccount).toString(), //receiver (self)
    }),
  });

  return uint256.uint256ToBN({
    low: liquidityBalance.result[1],
    high: liquidityBalance.result[0],
  });
};

// ERC 20 Swap amount

export const getSwapAmount = async (
  tokenInIndex: number,
  tokenOutIndex: number,
  amountIn: string
) => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  return await starknet.provider.callContract({
    contract_address: proxyAddress,
    entry_point_selector: swapAmountSelector,
    calldata: compileCalldata({
      amount_in: amountIn,
      pool_address: poolAddress,
      erc20_address_in: tokens[tokenInIndex].address,
      erc20_address_out: tokens[tokenOutIndex].address,
    }),
  });
};

// ERC 20 deposit to lp amount
export const getDepositERC20Amount = async (
  tokenInIndex: number,
  amountIn: string
) => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  return await starknet.provider.callContract({
    contract_address: proxyAddress,
    entry_point_selector: depositAmountSelector,
    calldata: compileCalldata({
      amount_to_deposit: amountIn,
      pool_address: poolAddress,
      erc20_address: tokens[tokenInIndex].address,
    }),
  });
};

// LP Token withdraw to erc20 amount
export const getWithdrawERC20Amount = async (
  tokenInIndex: number,
  amountIn: string
) => {
  const starknet = getStarknet();

  const [activeAccount] = await starknet.enable();

  // checks that enable succeeded
  if (starknet.isConnected === false)
    throw Error("starknet wallet not connected");

  return await starknet.provider.callContract({
    contract_address: proxyAddress,
    entry_point_selector: withdrawAmountSelector,
    calldata: compileCalldata({
      pool_amount_in: amountIn,
      pool_address: poolAddress,
      erc20_address: tokens[tokenInIndex].address,
    }),
  });
};
