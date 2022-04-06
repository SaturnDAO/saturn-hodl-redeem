
import { Typography, Container, Card, Theme, useTheme, ButtonGroup, Divider, Button } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { useContext } from 'react'
import { CtxEthers } from '../context'
import { classicprovider } from '../lib'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      height: '100%'
    },
  })
)

interface WrongChainProps {
  chainId?: number
}

const WrongChain: React.FC<WrongChainProps> = ({ chainId }) => {
  const classes = useStyles(useTheme())
  const { switchChain, addChain } = useContext(CtxEthers)

  return <>
    <Container className={classes.root} maxWidth='md'>
      <Card sx={{ p: 2, pt: 3 }}>
        <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
          Wrong Network detected <br />
          <Typography variant='caption'>
           CHAINID: {chainId || 'none' }
          </Typography>
        </Typography>

        <Typography variant='body1'>
          Please switch your provider wallet
        </Typography>

        <Divider />

        <ButtonGroup color='warning' variant='text' fullWidth>
          <Button onClick={() => switchChain(1)}>
            Ethereum
          </Button>
          <Button onClick={async () => switchChain(61)
            .catch(error => {
              if (error['message'].includes('Unrecognized chain ID')) {
                console.log(`ADDING CLASSIC PROVIDER`)
                addChain(classicprovider)
              }
            })
          }>
            Ethereum Classic
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  </>
}

export default WrongChain