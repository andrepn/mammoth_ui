import { getStarknet } from "@argent/get-starknet";

export const getStarkNetProvider = async () => {
  const starknet = getStarknet();
  const [userWalletContractAddress] = await starknet.enable({
    showModal: true,
  });

  return starknet;
};
