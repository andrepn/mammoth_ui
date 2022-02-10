import { getStarknet } from "@argent/get-starknet";
import { compileCalldata, number, stark, uint256 } from "starknet";
import { utils } from "ethers";

const tokenOne = {
  address: "0x06a6a94887bf9bdfaf3b080a4a8769a3ddeec99240cf24b7f484939b4398e390",
  name: "testUSDC",
  symbol: "TUSDC",
};

const tokenTwo = {
  address: "0x02b9f472382e960f9e6487bcad56892c528574c71f10b004c4a816468b88bcf6",
  name: "FantieCoin",
  symbol: "FC",
};

const tokenThree = {
  address: "0x027a7652ab6290ccab4666dd695fbdca1751478439464fe07c345b9a18b70af3",
  name: "testETH",
  symbol: "TEETH",
};

export const tokens = [tokenOne, tokenTwo, tokenThree];

const liquidityTokenAddress =
  "0x03fbe61a73d60af114288dd919ee51deb7599b27e842ac16b8c8967776eec432";
const poolAddress =
  "0x0209223018b9ed8a4c6968c56e82861438967793c3f4c9005ff82164c2bb3e83";

const proxyAddress = "";

const mintSelector = stark.getSelectorFromName("mint");

const balanceOfSelecter = stark.getSelectorFromName("balanceOf");

const swapAmountSelector = stark.getSelectorFromName("view_out_given_in");

const depositAmountSelector = stark.getSelectorFromName(
  "view_pool_minted_given_single_in"
);

const withdrawAmountSelector = stark.getSelectorFromName(
  "view_single_out_given_pool_in"
);

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

  return [balances];
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

  return liquidityBalance;
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
