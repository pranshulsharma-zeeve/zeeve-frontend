/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useToast } from "@zeeve-platform/ui";
import { AccountData, anyToSinglePubkey, encodePubkey, OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, DeliverTxResponse, GasPrice, defaultRegistryTypes } from "@cosmjs/stargate";
import { Keplr, OfflineAminoSigner } from "@keplr-wallet/types";
import {
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { PubKey as PubKeyProto } from "cosmjs-types/cosmos/crypto/ed25519/keys";
import { fromBase64, fromBech32, toBech32 } from "@cosmjs/encoding";
import { MsgUnjail } from "cosmjs-types/cosmos/slashing/v1beta1/tx";
import { MsgCreateValidator, MsgEditValidator, MsgUndelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import axios from "axios";
import { ValidatorNodeType } from "@/types/network";
// Define the supported networks
const networks = ["coreum-testnet-1", "coreum-mainnet-1"] as const;
type Network = (typeof networks)[number];
const errorMsgToInstallKeplr = `Please visit https://chains.keplr.app/ to add the Coreum Testnet/Mainnet network. If you haven't installed Keplr yet, you can do so from the same page.`;

export const useKeplr = (
  network: string,
  selectedWallet: "keplr" | "cosmostation" | "leap",
  selfDelegationAddr?: string,
) => {
  const [error, setError] = useState<string | undefined>();
  const [chainId, setChainId] = useState<Network | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [client, setClient] = useState<SigningStargateClient | undefined>();
  const [aminoSigner, setAminoSigner] = useState<OfflineAminoSigner | undefined>();
  const [accounts, setAccounts] = useState<readonly AccountData[]>([]);
  const [rpc, setRpc] = useState<string | undefined>();
  const [rest, setRest] = useState<string | undefined>();
  const restRef = useRef<string | undefined>(undefined);
  const [validatorOwner, setValidatorOwner] = useState<string | undefined>(selfDelegationAddr);
  const [isInitialized, setIsInitialized] = useState(false);
  const toast = useToast();
  // Refs to avoid relying on async state between initialize and first action
  const clientRef = useRef<SigningStargateClient | undefined>(undefined);
  const accountsRef = useRef<readonly AccountData[]>([]);
  const validatorOwnerRef = useRef<string | undefined>(selfDelegationAddr);
  const chainIdRef = useRef<Network | undefined>(undefined);

  const getRestBaseUrl = (): string => {
    const candidate = restRef.current;
    if (candidate && /^https?:\/\//.test(candidate)) {
      return candidate.replace(/\/$/, "");
    }
    const isTestnet = chainIdRef.current === "coreum-testnet-1" || network === "testnet";
    return isTestnet ? "https://rest.testcosmos.directory/coreumtestnet" : "https://rest.cosmos.directory/coreum";
  };

  // Reset init flag when critical params change
  useEffect(() => {
    setIsInitialized(false);
  }, [network, selectedWallet]);

  // Remove the automatic useEffect initialization
  // useEffect(() => {
  //   // Only initialize if network is provided and not already initialized
  //   if (!network || isInitialized) return;
  //
  //   console.log(selectedWallet, "wallet");
  //   let connection;
  //   if (selectedWallet === "keplr") {
  //     connection = window.keplr;
  //     console.log("window.keplr is fine");
  //   } else if (selectedWallet === "cosmostation") {
  //     connection = window.cosmostation?.providers?.keplr;
  //   } else if (selectedWallet === "leap") {
  //     connection = window.leap;
  //   } else {
  //     setError("Please select a wallet");
  //     return;
  //   }
  //   console.log("connection", connection);
  //   setValidatorOwner(selfDelegationAddr);
  //   if (!connection || !connection.getOfflineSigner) {
  //     selectedWallet === "keplr"
  //       ? console.log("You need to install Keplr")
  //       : console.log(`You need to install ${selectedWallet}`);
  //     setError(`You need to install ${selectedWallet}`);
  //   } else {
  //     const initialChainId: Network = network === "testnet" ? "coreum-testnet-1" : "coreum-mainnet-1";
  //     setChainId(initialChainId);

  //     const offlineSigner = connection.getOfflineSigner(initialChainId);
  //     console.log(offlineSigner, "offline");

  //     connectToKeplr(connection, initialChainId, offlineSigner);
  //   }

  //   // Cleanup on component unmount
  //   return () => {
  //     connection = null;
  //     if (client) client?.disconnect();
  //   };
  // }, [network, selfDelegationAddr, selectedWallet, isInitialized]);

  const initializeKeplr = async () => {
    // Always refresh the expected owner from latest prop
    validatorOwnerRef.current = selfDelegationAddr;
    setValidatorOwner(selfDelegationAddr);

    if (!network) return;
    if (isInitialized) return;

    console.log(selectedWallet, "wallet");
    let connection;
    if (selectedWallet === "keplr") {
      connection = window.keplr;
      console.log("window.keplr is fine");
    } else if (selectedWallet === "cosmostation") {
      connection = window.cosmostation?.providers?.keplr;
    } else if (selectedWallet === "leap") {
      connection = window.leap;
    } else {
      setError("Please select a wallet");
      return;
    }
    console.log("connection", connection);
    if (!connection || !connection.getOfflineSigner) {
      selectedWallet === "keplr"
        ? console.log("You need to install Keplr")
        : console.log(`You need to install ${selectedWallet}`);
      const message = `You need to install ${selectedWallet}`;
      setError(message);
      throw new Error(message);
    } else {
      const initialChainId: Network = network === "testnet" ? "coreum-testnet-1" : "coreum-mainnet-1";
      chainIdRef.current = initialChainId;
      setChainId(initialChainId);

      const offlineSigner = connection.getOfflineSigner(initialChainId);
      console.log(offlineSigner, "offline");

      await connectToKeplr(connection, initialChainId, offlineSigner);
      if (!clientRef.current || accountsRef.current.length === 0) {
        throw new Error(throwNoWalletErrorMsg(selectedWallet));
      }
      setIsInitialized(true);
    }
  };

  const connectToKeplr = async (
    keplr: Keplr,
    chainId: Network,
    offlineSigner: OfflineAminoSigner & OfflineDirectSigner,
  ) => {
    try {
      setLoading(true);
      console.log({ selectedWallet });

      if (selectedWallet === "cosmostation" || selectedWallet === "leap" || selectedWallet === "keplr") {
        console.log("suggesting chain for", selectedWallet);
        try {
          const response =
            chainId === "coreum-testnet-1"
              ? await fetch(
                  "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/refs/heads/main/cosmos/coreum-testnet.json",
                )
              : await fetch(
                  "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/refs/heads/main/cosmos/coreum-mainnet.json",
                );
          const chainInfo = await response.json();

          // Add (suggest) the chain to the wallet if it's missing
          if (typeof keplr.experimentalSuggestChain === "function") {
            await keplr.experimentalSuggestChain(chainInfo);
            console.log(`Successfully suggested chain ${chainId} to ${selectedWallet}.`);
          }
        } catch (fetchError) {
          console.error("Failed to fetch/suggest chain info:", fetchError);
        }
      }
      console.log("trying Keplr Wallet is enabled");
      await keplr.enable(chainId);
      console.log("Keplr Wallet is enabled");

      const registry = new Registry(defaultRegistryTypes);

      registry.register(MsgUnjail.typeUrl, MsgUnjail);
      console.log("registry done");

      const rpcUrl =
        network === "testnet"
          ? "https://rpc.testcosmos.directory/coreumtestnet"
          : "https://rpc.cosmos.directory/coreum";

      const restUrl =
        network === "testnet"
          ? "https://rest.testcosmos.directory/coreumtestnet"
          : "https://rest.cosmos.directory/coreum";

      setRpc(rpcUrl);
      setRest(restUrl);
      restRef.current = restUrl;
      console.log("set Rpc and rest url");
      console.log("chain id", chainId);

      const client = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner, {
        gasPrice: GasPrice.fromString(chainId === "coreum-testnet-1" ? "1utestcore" : "1ucore"),
        registry: registry,
      });

      const aminoSigner = keplr.getOfflineSignerOnlyAmino(chainId);

      // Keep both state and refs in sync
      clientRef.current = client;
      setClient(client);
      setAminoSigner(aminoSigner);
      const accs = await offlineSigner.getAccounts();
      accountsRef.current = accs;
      setAccounts(accs);
      console.log("Wallet is changed");
    } catch (err: any) {
      console.log("ERROR");
      const message = mapErrorToUserMessage(err, { selectedWallet, chainId: chainIdRef.current });
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError(undefined);
  };

  const validateKeplr = (addr: string) => {
    const owner = validatorOwnerRef.current?.trim();
    const address = addr?.trim();
    console.log({ validatorOwner: owner, addr: address });

    if (!clientRef.current) {
      throw new Error(`Please install ${selectedWallet} wallet`);
    }
    if (!owner || owner !== address) {
      throw new Error("Please select the same wallet which was used while creating the validator");
    }
  };

  const withdrawRewards = async (validatorAddress: string, onlyReward?: boolean): Promise<string | undefined> => {
    if (error === `You need to install ${selectedWallet}`) {
      toast(`You need to install ${selectedWallet}`, {
        status: "warning",
      });
      return;
    }
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }

    const accountAddress = accs[0].address;
    validateKeplr(accountAddress);

    const rewardData = MsgWithdrawDelegatorReward.fromPartial({
      delegatorAddress: accountAddress,
      validatorAddress,
    });

    const commissionData = MsgWithdrawValidatorCommission.fromPartial({
      validatorAddress,
    });

    // Construct the message for withdrawing rewards
    const withdrawRewardsMsg = {
      typeUrl: MsgWithdrawDelegatorReward.typeUrl,
      value: rewardData,
    };

    // construct the message for commission rewards
    const commissionMsg = {
      typeUrl: MsgWithdrawValidatorCommission.typeUrl,
      value: commissionData,
    };

    console.log(withdrawRewardsMsg, commissionMsg);

    const msgs = onlyReward ? [withdrawRewardsMsg] : [withdrawRewardsMsg, commissionMsg];

    // Broadcast the transaction
    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, msgs, "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to withdraw rewards:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully withdrew rewards:", result);
      setError(undefined); // Clear any previous errors
    }
    return result.transactionHash;
  };

  const updateValidatorDetails = async (
    validatorAddress: string,
    validatorDetails: Partial<
      Pick<
        ValidatorNodeType["inputs"],
        | "validatorName"
        | "commissionRate"
        | "commissionMaxRate"
        | "commissionMaxChangeRate"
        | "email"
        | "description"
        | "validatorIdentity"
        | "website"
        | "accountValidatorMonikerId"
        | "minDelegationAmount"
      >
    >,
  ): Promise<string> => {
    if (error === `You need to install ${selectedWallet}`) {
      toast(`You need to install ${selectedWallet}`, {
        status: "warning",
      });
      return "";
    }
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }
    const accountAddress = accs[0].address;
    validateKeplr(accountAddress);

    const identityData: any = {
      validatorAddress,
      description: {
        identity: validatorDetails.validatorIdentity,
        moniker: validatorDetails.validatorName,
        website: validatorDetails.website,
        securityContact: (validatorDetails.email ?? "").trim(),
        details: validatorDetails.description,
      },
    };
    console.log(
      "----commissionRate----337",
      validatorDetails.commissionRate,
      "---commissionMaxRate----",
      validatorDetails.commissionMaxRate,
      "---commissionMaxChangeRate----",
      validatorDetails.commissionMaxChangeRate,
    );
    // Process commission fields only if they are present (matching working pattern)
    if (validatorDetails.commissionRate !== undefined && validatorDetails.commissionRate !== null) {
      console.log("updateValidatorDetails - Commission rate being updated:", validatorDetails.commissionRate);
      identityData.commissionRate = toCosmosDec(validatorDetails.commissionRate);
      console.log("Commission rate after processing:", identityData.commissionRate);
    }

    if (validatorDetails.commissionMaxRate !== undefined && validatorDetails.commissionMaxRate !== null) {
      console.log("updateValidatorDetails - Commission max rate being updated:", validatorDetails.commissionMaxRate);
      identityData.commissionMaxRate = toCosmosDec(validatorDetails.commissionMaxRate);
      console.log("Commission max rate after processing:", identityData.commissionMaxRate);
    }

    if (validatorDetails.commissionMaxChangeRate !== undefined && validatorDetails.commissionMaxChangeRate !== null) {
      console.log(
        "updateValidatorDetails - Commission max change rate being updated:",
        validatorDetails.commissionMaxChangeRate,
      );
      identityData.commissionMaxChangeRate = toCosmosDec(validatorDetails.commissionMaxChangeRate);
      console.log("Commission max change rate after processing:", identityData.commissionMaxChangeRate);
    }

    // Construct the message for withdrawing rewards
    const identityMsg = {
      typeUrl: MsgEditValidator.typeUrl,
      value: identityData,
    };

    console.log(identityMsg);

    const msgs = [identityMsg];

    // Broadcast the transaction
    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, msgs, "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to withdraw rewards:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully withdrew rewards:", result);
    }
    return result.transactionHash;
  };

  const setRewardWallet = async (withdrawAddress: string): Promise<string | undefined> => {
    if (error === `You need to install ${selectedWallet}`) {
      toast(`You need to install ${selectedWallet}`, {
        status: "warning",
      });
      return;
    }
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }

    const accountAddress = accs[0].address;
    validateKeplr(accountAddress);

    const withdrawWalletData = MsgSetWithdrawAddress.fromPartial({
      delegatorAddress: accountAddress,
      withdrawAddress,
    });

    // construct the message for commission rewards
    const withdrawWalletMsg = {
      typeUrl: MsgSetWithdrawAddress.typeUrl,
      value: withdrawWalletData,
    };

    console.log(withdrawWalletMsg);

    const msgs = [withdrawWalletMsg];

    // Broadcast the transaction
    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, msgs, "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to withdraw rewards:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully withdrew rewards:", result);
      setError(undefined); // Clear any previous errors
    }
    return result.transactionHash;
  };

  const unboundToken = async (validatorAddress: string, uToken: number): Promise<string | undefined> => {
    if (error === `You need to install ${selectedWallet}`) {
      toast(`You need to install ${selectedWallet}`, {
        status: "warning",
      });
      return;
    }
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }

    const accountAddress = accs[0].address;
    validateKeplr(accountAddress);

    const denom = chainIdRef.current === "coreum-testnet-1" ? "utestcore" : "ucore";

    const withdrawWalletData = MsgUndelegate.fromPartial({
      delegatorAddress: accountAddress,
      validatorAddress,
      amount: {
        amount: uToken.toString(),
        denom,
      },
    });

    // construct the message for commission rewards
    const withdrawWalletMsg = {
      typeUrl: MsgUndelegate.typeUrl,
      value: withdrawWalletData,
    };

    console.log(" unboundToken", withdrawWalletMsg);

    const msgs = [withdrawWalletMsg];

    // Broadcast the transaction
    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, msgs, "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }
    console.log(result);

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to withdraw rewards:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully withdrew rewards:", result);
      setError(undefined); // Clear any previous errors
    }
    return result.transactionHash;
  };

  const unjail = async (validatorAddr: string): Promise<string | undefined> => {
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }

    const accountAddress = accs[0].address;
    validateKeplr(accountAddress);

    const withdrawWalletData = MsgUnjail.fromPartial({
      validatorAddr,
    });

    // construct the message for unjail
    const withdrawWalletMsg = {
      typeUrl: MsgUnjail.typeUrl,
      value: withdrawWalletData,
    };

    console.log("unjail", withdrawWalletMsg);

    // Broadcast the transaction
    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, [withdrawWalletMsg], "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }
    console.log(result);

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to unjail:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully unjailed:", result);
      setError(undefined); // Clear any previous errors
    }
    return result.transactionHash;
  };

  const createValidator = async (
    network: Pick<
      ValidatorNodeType["inputs"],
      | "validatorName"
      | "commissionRate"
      | "commissionMaxRate"
      | "commissionMaxChangeRate"
      | "email"
      | "description"
      | "validatorIdentity"
      | "website"
      | "minDelegationAmount"
      | "delegationAmount"
    > & {
      pubKey: {
        type: string;
        value: string;
      };
    },
  ) => {
    if (error === `You need to install ${selectedWallet}`) {
      toast(`You need to install ${selectedWallet}`, {
        status: "warning",
      });
      return { txHash: undefined, validatorAddress: undefined, delegationAddress: undefined };
    }
    const c = clientRef.current;
    const accs = accountsRef.current;
    if (!c || accs.length === 0) {
      if (error) {
        if (isUserRejectedError(error)) {
          toast(`Request rejected by user`, {
            status: "error",
          });
          throw new Error("Request rejected by user");
        }
        toast(`${error}`, {
          status: "error",
        });
        throw new Error(error);
      }
      throw new Error(throwNoWalletErrorMsg(selectedWallet));
    }

    const accountAddress = accs[0].address;
    console.log("accountAddress", accountAddress);
    const validatorAddress = toValidatorAddress(accountAddress);
    console.log("validated address");

    if (await validatorExist(validatorAddress)) {
      throw new Error("Validator already exist: " + validatorAddress);
    }

    const denom = chainIdRef.current === "coreum-testnet-1" ? "utestcore" : "ucore";
    console.log("validator creation starts");

    const createValidatorData = MsgCreateValidator.fromPartial({
      commission: {
        maxChangeRate: toCosmosDec(percentToFraction(network.commissionMaxChangeRate)),
        maxRate: toCosmosDec(percentToFraction(network.commissionMaxRate)),
        rate: toCosmosDec(percentToFraction(network.commissionRate)),
      },
      delegatorAddress: accountAddress,
      description: {
        details: network.description,
        identity: network.validatorIdentity,
        moniker: network.validatorName,
        website: network.website,
        securityContact: (network.email ?? "").trim(),
      },
      minSelfDelegation: getDecimalValue(network.minDelegationAmount),
      pubkey: encodePubkey(
        anyToSinglePubkey({
          typeUrl: network.pubKey.type,
          value: PubKeyProto.encode({
            key: fromBase64(network.pubKey.value),
          }).finish(),
        }),
      ),
      validatorAddress: validatorAddress,
      value: {
        amount: getDecimalValue(network.delegationAmount),
        denom,
      },
    });

    const createValidatorMsg = {
      typeUrl: MsgCreateValidator.typeUrl,
      value: createValidatorData,
    };

    console.log(JSON.stringify(createValidatorMsg));

    let result: DeliverTxResponse;
    try {
      result = await c.signAndBroadcast(accountAddress, [createValidatorMsg], "auto");
    } catch (e: any) {
      throw new Error(mapErrorToUserMessage(e, { selectedWallet, chainId: chainIdRef.current }));
    }

    if (result.code !== undefined && result.code !== 0) {
      console.error("Failed to withdraw rewards:", result);
      throw new Error(mapErrorToUserMessage(result, { selectedWallet, chainId: chainIdRef.current }));
    } else {
      console.log("Successfully withdrew rewards:", result);
      setError(undefined); // Clear any previous errors
    }
    return { txHash: result.transactionHash, validatorAddress, delegationAddress: accountAddress };
  };

  const validatorExist = async (validatorAddress: string) => {
    try {
      const url = `${getRestBaseUrl()}/cosmos/staking/v1beta1/validators/${validatorAddress}`;
      console.log("validatorExist URL:", url);
      const resp = await axios.get(url);
      // if we got here, resp.status===200
      return resp.data.validator != null;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return false;
      }
      // Network/CSP errors often surface without a response object
      if (!err.response) {
        console.warn(
          "validatorExist: network/CSP error while checking validator existence, assuming not existing",
          err?.message || err,
        );
        return false;
      }
      // some other failure (500, etc.)
      throw err;
    }
  };

  return {
    error,
    loading,
    client,
    accounts,
    updateValidatorDetails,
    withdrawRewards,
    retry,
    setRewardWallet,
    unboundToken,
    unjail,
    createValidator,
    initializeKeplr,
  };
};

function getDecimalValue(value: number): string {
  return BigInt(value * 1000000).toString();
}

function toValidatorAddress(delegatorAddr: string) {
  const { prefix, data } = fromBech32(delegatorAddr);
  return toBech32(`${prefix}valoper`, data);
}
function throwNoWalletErrorMsg(selectedWallet: string) {
  return selectedWallet === "keplr"
    ? `Please visit https://chains.keplr.app/ to add the Coreum Testnet/Mainnet network. If you haven't installed Keplr yet, you can do so from the same page.`
    : `Please add the Coreum Testnet/Mainnet network. If you haven't installed ${selectedWallet} yet, Please install it.`;
}

function isUserRejectedError(err: any): boolean {
  const message = (typeof err === "string" ? err : err?.message || "").toString().toLowerCase();
  const code = err?.code ?? err?.data?.code;
  return (
    message.includes("request rejected") ||
    message.includes("user rejected") ||
    message.includes("rejected by user") ||
    message.includes("user denied") ||
    code === 4001 ||
    code === "4001"
  );
}

function mapErrorToUserMessage(err: any, opts?: { selectedWallet?: string; chainId?: string }): string {
  if (!err) return "Something went wrong. Please try again.";
  if (isUserRejectedError(err)) return "Request rejected by user";
  const lower = (err?.message || err?.rawLog || String(err)).toLowerCase();
  const denom = opts?.chainId === "coreum-testnet-1" ? "utestcore" : "ucore";

  if (lower.includes("does not have enough") || lower.includes("insufficient funds")) {
    return `Insufficient ${denom} balance to cover self-delegation and fees. Top up your wallet or reduce the amount and try again.`;
  }
  if (lower.includes("invalid coin denomination")) {
    return "Invalid token denomination for this network. Please switch to the correct Coreum network in your wallet and try again.";
  }
  if (lower.includes("validator already exist")) {
    return "A validator already exists for this address.";
  }
  if (lower.includes("network error") || lower.includes("failed to fetch")) {
    return "Network error while contacting the blockchain. Check your connection or browser/network settings and try again.";
  }
  if (typeof err === "string" && err.toLowerCase().includes("add the coreum testnet/mainnet")) {
    return err;
  }
  const wallet = opts?.selectedWallet ?? "wallet";
  if (lower.includes("keplr") && lower.includes("install")) {
    return `Please install ${wallet} and add the Coreum network, then retry.`;
  }
  return (err?.message || "Transaction failed. Please try again.").toString();
}

function percentToFraction(value: number | string | undefined | null): number {
  if (value === undefined || value === null) {
    throw new Error("Invalid percentage value");
  }
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(parsed)) {
    throw new Error("Invalid percentage value");
  }
  return parsed / 100;
}

export function toCosmosDec(value: number | string): string {
  const decimal = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(decimal)) throw new Error("Invalid number");

  // Convert to 18-decimal fixed-point integer representation
  const bigIntValue = BigInt(Math.floor(decimal * 1e18));
  return bigIntValue.toString();
}
