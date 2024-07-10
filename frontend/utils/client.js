import { createPublicClient, http } from "viem";
import { hardhat, baseSepolia} from "viem/chains";

const RPC = process.env.NODE_ENV === "production" ? "https://base-sepolia.g.alchemy.com/v2/tGme5Xxh6EqJy8KrDbt9-ZTb6pr-3wK3" : "";


export const publicClient = createPublicClient({
  chain: process.env.NODE_ENV === "production" ? baseSepolia : hardhat,
  transport: http(RPC),
});
