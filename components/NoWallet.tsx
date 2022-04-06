
import { Typography, Container, Card, Theme, useTheme } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      height: '100%'
    },
  })
)

const NoWallet: React.FC = props => {
  const classes = useStyles(useTheme())
  return <>
    <Container className={classes.root} maxWidth='md'>
      <Card sx={{ p: 2, pt: 3 }}>
        <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
          No wallet found
        </Typography>

        <Typography variant='body1'>
          your browser has not a web3 provider injected.
        </Typography>
      </Card>
    </Container>
  </>
}

export default NoWallet