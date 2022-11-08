import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'hardhat-deploy';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';
import { BSC_PRIVATE_KEY, ETH_API_KEY, POLYGON_PRIVATE_KEY, TEST_PRIVATE_KEY } from './env';

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    private: {
      url: 'http://52.12.224.224:8545',
      chainId: 1337,
      accounts: [TEST_PRIVATE_KEY],
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [TEST_PRIVATE_KEY],
    },
    bscmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      accounts: [BSC_PRIVATE_KEY],
    },
    polygon: {
      url: 'https://matic-mainnet.chainstacklabs.com',
      chainId: 137,
      accounts: [POLYGON_PRIVATE_KEY],
    },
    mumbai: {
      url: 'https://rpc-mumbai.matic.today/',
      chainId: 80001,
      accounts: [POLYGON_PRIVATE_KEY],
    },
    kovan: {
      url: 'https://speedy-nodes-nyc.moralis.io/894483ce389226d7ea608ba8/eth/kovan',
      chainId: 42,
      accounts: [TEST_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETH_API_KEY,
  },
  namedAccounts: typedNamedAccounts({
    deployer: 0,
    // owner: {
    //   polygon: '0x12433....124',
    //   bsctestnet: '0x12433....124',
    //   mumbai: '0x12433....124',
    // },
  }),
};

export default config;

task('verify-all', async (_, { run, deployments, ethers }) => {
  const { typedDeployments } = await import('./shared/typed-hardhat-deploy');
  const { get } = typedDeployments(deployments);
  const names = ['E8MintableNft', 'E8MarketPlace'] as const;
  for (const name of names) {
    const { address } = await get(name);
    try {
      await run('verify:verify', { address });
    } catch (e) {
      console.error(e);
    }
  }
});
