import Hashicon from './Hashicon'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { Button, Chip, IconButton, Paper, Tooltip, Toolbar, Box, AppBar } from '@mui/material'
import { CtxEthers } from '../context'
import { useForceUpdate } from '../hooks'

const NavigationBar: React.FC = () => {
  const update = useForceUpdate()
  const router = useRouter()
  const { walletAddress, enable, noInjectedProvider,addChain } = useContext(CtxEthers)!

  useEffect(() => {
    update()
  }, [walletAddress])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color='inherit' component={Paper}>
        <Toolbar variant="dense">
          {walletAddress && <Tooltip title='Open HODL contract' placement='bottom-start'>
            <Chip
              size='small'
              label={walletAddress}
              color='success'
              variant={'outlined'}
              onClick={() => router.push('/')}
              icon={<Hashicon value={walletAddress} size={12} style={{ marginLeft: '6px' }} />}
            />
          </Tooltip>}
          <div style={{ flexGrow: 1 }} />
          {!walletAddress && <>
            {!noInjectedProvider &&
              <Button onClick={() => enable()} sx={{ ml: 2 }}>
                ENABLE WALLET
              </Button>
            }
          </>}
          <IconButton>
            <img src='saturn.png' alt='phx logo' height={24} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavigationBar