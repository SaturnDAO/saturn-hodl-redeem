export * from './theme'

export const classicprovider: AddEthereumChainParameter = {
  "chainId": "0x3d",
  "chainName": "Ethereum Classic",
  "rpcUrls": ["https://ethercluster.com/etc"],
  "iconUrls": [
    "https://ethereumclassic.org/favicon.ico"
  ],
  "blockExplorerUrls": ["https://blockscout.com/etc/mainnet"],
  "nativeCurrency": {
    "name": 'Ethereum Classic',
    "symbol": 'ETC',
    "decimals": 18
  }
}