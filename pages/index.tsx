import Head from 'next/head'
import WrongChain from '../components/WrongChain'
import EnableWallet from '../components/EnableWallet'
import NoWallet from '../components/NoWallet'
import Hashicon, { getHashiconImgData } from '../components/Hashicon'
import { CtxEthers } from '../context'
import { Hodl__factory } from 'saturn-hodl-abi/ethers'
import { BigNumber } from 'ethers'
import { useCallback, useContext, useEffect, useState } from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { createStyles, makeStyles } from '@mui/styles'
import { 
  Button, Theme, Typography, TextField, ButtonProps, useTheme, Container,
  Divider, Grid, Card, Stack, Snackbar, Alert, InputAdornment,
} from '@mui/material'

import * as T from '../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
      height: '95%'
    },
  })
)

const hashicons = new Map<string, string>()

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'ID', width: 50 },
  {
    field: 'hash',
    headerName: ' ',
    width: 16,
    renderCell: (params) => {
      const data = hashicons.has(params.value)
        ? hashicons.get(params.value)
        : getHashiconImgData(params.value)

      return <img src={data} height={16} alt={params.value} />
    },
  },
  { field: 'col2', headerName: 'Purchaser', width: 400 },
  { field: 'col3', headerName: 'Locktime', width: 80 },
  { field: 'col4', headerName: 'Tokens', width: 120, type: 'number' },
  { field: 'col5', headerName: 'EtherPaid', width: 100, type: 'number',  },
]

function contractAddresByChainId (chainId: number) {
  if (chainId === 1) return '0x9115d1BD01E3eE3479ce751F878283457d69Ec7A'
  if (chainId === 61) return '0x46280631dAC3f32C43D57570433AB28D10b95994'
}

function contractFromBlock (chainId: number) {
  if (chainId === 1) return 9910080
  if (chainId === 61) return 10221648
}

function formatData (data: T.PurchaseParams[]) {
  const parsed: GridRowsProp = data.map((p, id) => ({
    id, col1: Number(p.id), hash: p.purchaser, col2: p.purchaser, col3: p.hodltype,
    col4: Number(p.amount.shiftedBy(-4)), col5: Number(p.etherPaid.shiftedBy(-18))
  }))

  return parsed
}

const HodlRedeem: React.FC = props => {
  const classes = useStyles(useTheme())
  const { provider, walletAddress, chainId, noInjectedProvider } = useContext(CtxEthers)
  const [contractAddress, setContractAddress] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState<string>()
  const [contract, setContract] = useState<T.Hodl>()
  const [orderId, setOrderId] = useState<number>(0)
  const [purchaser, setPurchaser] = useState<string>('')
  const [orderInfo, setOrderInfo] = useState<T.OrderInfo>()
  const [purchases, setPurchases] = useState<T.PurchaseParams[]>()
  const [rows, setRows] = useState<GridRowsProp>()

  useEffect(() => {
    const contractAddr = contractAddresByChainId(chainId!)
    setContractAddress(contractAddr!)
  }, [chainId])

  useEffect(() => {
    if (!purchases) return

    setRows(formatData(purchases))
  }, [purchases])
  
  useEffect(() => {
    if (!purchases || !purchaser) return

    if (purchaser.isAddress()) {
      const found = purchases.filter(x => x.purchaser.addrIsEqaul(purchaser))
      if (found.length > 0) setRows(formatData(found))
      else setRows(formatData(purchases))
    } else setRows(formatData(purchases))
  }, [purchaser])

  useEffect(() => {
    if (!walletAddress || !provider || !contractAddress) return
    setContract(undefined)

    if (purchaser === '') setPurchaser(walletAddress)
  }, [walletAddress, contractAddress])

  useEffect(() => {
    if (!orderId) return
    if (orderId <= 0) return
    getOrderInfo().then(setOrderInfo)
  }, [ orderId ])

  useEffect(() => {
    if (contract) return
    if (!provider) return
    if (!contractAddress) return
    if (!contractAddress.isAddress()) return

    try {
      setContract(Hodl__factory.connect(contractAddress, provider))
    }catch(error) {
      setContract(undefined)
    }
  })

  function getBtnColor (): ButtonProps['color'] {
    if (!orderInfo) return 'warning'
    if (orderInfo.isClaimed) return 'error'
    
    return 'success'
  }

  function getAmount () {
    if (!orderInfo) return
    if (orderInfo.isClaimed) return ' (CLAIMED)'

    const amount = Number(orderInfo.amountOf.shiftedBy(-4)).toLocaleString()
    let result = ` - ${amount} SATURN`
    if (orderInfo.isVIP) result = ' (VIP)'

    return result
  }

  function btnIsDisabled () {
    if (!orderInfo || !walletAddress) return true
    return !walletAddress.addrIsEqaul(orderInfo.purchaser)
  }

  function handleClose (event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === 'clickaway') return
    setOpen(false)
    setMsg(undefined)
  }

  function snack (message: string) {
    setMsg(message)
    setOpen(true)
  }

  async function getEventLogs () {
    if (!provider || !contract || !contractAddress) return
    const fromBlock = contractFromBlock(chainId!)
    const iface = Hodl__factory.createInterface()
    const topic = iface.getEventTopic('Purchase')
    const logs = await provider.getLogs({
      address: contractAddress, fromBlock,
      toBlock: 'latest', topics: [topic]
    }).catch(console.error)

    if (!logs) return

    const events = logs.map((log) => {
      const eventDesc = iface.parseLog(log)
      const { amount, etherPaid, hodltype, id, purchasedAt, purchaser, redeemAt } = eventDesc.args

      const params: T.PurchaseParams = {
        amount: `${amount}`, etherPaid: `${etherPaid}`, hodltype,
        id: `${id}`, purchasedAt: `${purchasedAt}`, purchaser,
        redeemAt: `${redeemAt}`
      }

      return params
    })

    setPurchases(events)

    return { logs, events }
  }
  
  function handleChange (ev: React.ChangeEvent<HTMLInputElement>) {
    switch(ev.target.id as keyof T.PurchaseValues) {
      case 'contractAddress':
        setContractAddress(ev.target.value)
        break
      case 'purchaser':
        setPurchaser(ev.target.value)
        break
      case 'id':
        setOrderId(Number(ev.target.value))
        break
    }
  }

  async function redeem () {
    if (!provider) return snack(`No Provider connected`)
    if (!orderId) return snack(`No HODL Order selelected`)

    try {
      const signer = await provider.getSigner()
      const contract = Hodl__factory.connect(contractAddress, signer)
      const tx = await contract.redeem(orderId)
      const receipt = await provider.waitForTransaction(tx.hash)
  
      return receipt

    }catch(error) { console.error(error) }
  }

  const getPurchaserInfo = useCallback(async (_purchaser?: string) => {
    if (!contract || !purchases || (!purchaser && !_purchaser)) return

    const p = _purchaser || purchaser
    const isVIP: boolean = await contract.isVIP(p).catch()
    const lastOrderId: BigNumber = await contract.latestOrderId()
    const totalRefferred: BigNumber = await contract.totalRefferred(p).catch()
    const params = purchases.find(x => x.purchaser.addrIsEqaul(p))!

    const result: T.PurchaserInfo = {
      purchaser: p, isVIP, params,
      lastOrderId: lastOrderId.toNumber(),
      totalRefferred: `${totalRefferred}`
    }

    return result
  }, [ contract, purchaser ])

  const getOrderInfo = useCallback(async () => {
    if (!contract || !purchases || !purchaser || !orderId || orderId <= 0) return

    const amountOf: BigNumber = await contract.amountOf(orderId)
    const lockupOf: BigNumber = await contract.lockupOf(orderId)
    const isClaimed: boolean = await contract.isClaimed(orderId)
    const { purchaser: p } = purchases.find(x => Number(x.id) === orderId)!
    const info = await getPurchaserInfo(p)!

    if (!info) return
    else if (info && !info.purchaser.addrIsEqaul(purchaser)) {
      setPurchaser(info.purchaser)
    }

    const result: T.OrderInfo = {
      orderId, isClaimed,
      ...info,
      amountOf: `${amountOf}`,
      lockupOf: `${lockupOf}`
    }

    return result
  }, [ contract, orderId, purchases, purchaser ])

  if (noInjectedProvider) return <NoWallet />
  if (typeof chainId === 'undefined') return <EnableWallet />
  if (![1, 61].includes(chainId!)) return <WrongChain chainId={chainId} />

  return <>
    <Head>
      <title>HODL Redeem</title>
    </Head>
    <Container className={classes.root} maxWidth='md'>
      <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
        HODL Redeem
      </Typography>

      <Card sx={{ p: 2, pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item sm={3} xs={12}>
            <TextField
              size='small'
              type={'number'}
              id="id"
              label="Hodl Order ID"
              variant='outlined'
              fullWidth
              value={orderId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item sm={9} xs={12}>
            <TextField
              size='small'
              id="contractAddress"
              label="Contract Address"
              variant='outlined'
              fullWidth
              value={contractAddress}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Hashicon value={contractAddress} size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Divider />

        <TextField
          size='small'
          id="purchaser"
          label="Purchasers Address"
          variant='outlined'
          fullWidth
          value={purchaser}
          onChange={handleChange}
          defaultValue={walletAddress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Hashicon value={purchaser} size={16} />
              </InputAdornment>
            ),
          }}
        />

        <Divider />

        {rows && <Button fullWidth variant='outlined' color={getBtnColor()} onClick={redeem}>
          Redeem {getAmount()}
        </Button>}
        {!rows && <Button fullWidth variant='outlined' color={'warning'} onClick={getEventLogs}>
          Find Purchase Events
        </Button>}
      </Card>

      <Divider />

      {rows && <Card sx={{ height: '50vh', width: '100%', padding: '1em'}}>
        <DataGrid
          rows={rows} columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowClick={({ row }) => {
            const { col1, col2 } = row
            setOrderInfo(undefined)
            setOrderId(col1)
            setPurchaser(col2)
          }}
        />
      </Card>}
      {!rows && <>
        <Alert severity="warning">
          This process can take a while. Please be patient :: contract {contractAddress}
        </Alert>
        </>}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={open} autoHideDuration={3000} onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {msg}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  </>
}

export default HodlRedeem