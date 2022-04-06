import { providers } from 'ethers'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { createContext, useEffect, useState } from 'react'
export interface Ctx {
  provider?: providers.Web3Provider
  block?: providers.Block
  blocknumber?: number
  walletAddress?: string
  chainId?: number
  noInjectedProvider: boolean
  
  enable(): Promise<void>
  sha3(input: string): string
  switchChain(chainId: number): Promise<null>
  addChain(options: AddEthereumChainParameter): Promise<null>
  isUnlocked(): Promise<boolean>
}

export const CtxEthers = createContext<Ctx>({} as any)

export interface EthersContextProps {
  autoEnable?: boolean
  disableChainReload?: boolean
}

const EthersContext: React.FC<EthersContextProps> = ({ children, autoEnable, disableChainReload }) => {
  const [provider, setProvider] = useState<providers.Web3Provider>()
  const [block, setBlock] = useState<providers.Block>()
  const [blocknumber, setBlocknumber] = useState<number>()
  const [chainId, setChainId] = useState<number>()
  const [walletAddress, setWalletAddress] = useState<string>()
  const [noInjectedProvider, setNoInjectedProvider] = useState(false)

  function sha3 (input: string) {
    return keccak256(toUtf8Bytes(input))
  }

  async function enable () {
    if (typeof window.ethereum.request === 'undefined') {
      setNoInjectedProvider(true)
      return
    }

    setNoInjectedProvider(false)

    const { request } = window.ethereum
    const accounts = await request({ method: 'eth_requestAccounts' })

    if (!accounts[0].isAddress()) return

    setWalletAddress(accounts[0])
    setProvider(new providers.Web3Provider(window.ethereum as any))
  }

  function handleAccountsChanged(accounts: string[]) {
    setWalletAddress(accounts[0])
  }

  function handleChainIdChanged (chainId: string) {
    if (disableChainReload) return window.location.reload()
    setChainId(chainId.toBN().toNumber())
    setProvider(new providers.Web3Provider(window.ethereum as any))
  }

  async function handleBlocknumber (blocknumber: number)  {
    setBlocknumber(blocknumber)

    const block = await provider!.getBlock(blocknumber)
    setBlock(block)
  }

  function switchChain (chainId: number) {
    const method = 'wallet_switchEthereumChain'
    const params = [{ chainId: `0x${chainId.toString(16)}` }]
    return window.ethereum.request({ method, params })
  }

  function addChain (options: AddEthereumChainParameter) {
    const method = 'wallet_addEthereumChain'
    return window.ethereum.request({ method, params: [ options ] })
  }

  async function isUnlocked (): Promise<boolean> {
    return await window.ethereum._metamask.isUnlocked()
  }

  useEffect(() => {
    setNoInjectedProvider(
      typeof window.ethereum.request === 'undefined'
    )
  }, [])

  useEffect(() => {
    if (!noInjectedProvider && autoEnable) enable()
  }, [noInjectedProvider])

  useEffect(() => {
    if (!provider) return
    const { chainId } = window.ethereum

    setChainId(chainId.toBN().toNumber())

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainIdChanged);

    provider.on('block', handleBlocknumber)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainIdChanged)

      provider.off('block', handleBlocknumber)
    }
  }, [ provider ])

  return <CtxEthers.Provider value={{
    provider, block, blocknumber, chainId, walletAddress, enable, sha3,
    noInjectedProvider, switchChain, isUnlocked, addChain
  }}>
    {children}
  </CtxEthers.Provider>
}

export default EthersContext