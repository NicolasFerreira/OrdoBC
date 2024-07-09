import { createPublicClient, http } from "viem";
import { hardhat, baseSepolia} from "viem/chains";

const RPC = process.env.NODE_ENV === "production" ? "https://base-sepolia-rpc.publicnode.com" : "";


export const publicClient = createPublicClient({
  chain: process.env.NODE_ENV === "production" ? baseSepolia : hardhat,
  transport: http(RPC),
});
