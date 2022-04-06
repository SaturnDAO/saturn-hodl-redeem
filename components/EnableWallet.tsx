
import { Typography, Container, Card, Theme, useTheme, Button, Divider } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { useContext } from 'react'
import { CtxEthers } from '../context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      height: '100%'
    },
    divider: {
      marginTop: '1em',
      marginBottom: '3em'
    }
  })
)

const EnableWallet: React.FC = props => {
  const classes = useStyles(useTheme())
  const { enable } = useContext(CtxEthers)

  return <>
    <Container className={classes.root} maxWidth='xs'>
      <Card sx={{ p: 2, pt: 3, textAlign: 'center' }}>
        <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
          Not Connected
        </Typography>
        <img src="saturn.png" alt='' />
        <Divider className={classes.divider} />
        <Button onClick={enable} variant='outlined' color='info' fullWidth>
          Enable Wallet
        </Button>
      </Card>
    </Container>
  </>
}

export default EnableWallet