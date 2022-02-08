import { TOKEN_ONE_ADDRESS } from "../../utils/addresses";
import { getStarkNetProvider } from "../../utils/starknet-provider";

export const fetchBalancesAPI = async () => {
  const starknet = await getStarkNetProvider();

  // balances.tokenOneBalance = await starknet.signer?.invokeFunction(TOKEN_ONE_ADDRESS)
};
