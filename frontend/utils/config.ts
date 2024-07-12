import { http, createConfig } from '@wagmi/core'
import { hardhat, baseSepolia } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [hardhat, baseSepolia],
  transports: {
    [hardhat.id]: http(),
    [baseSepolia.id]: http(),
  },
})

