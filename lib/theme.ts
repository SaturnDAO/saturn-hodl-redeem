import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#30373C',
      default: '#0F1218',
    },
    primary: {
      main: '#8b949e',
    },
    info: {
      main: '#8b949e',
      dark: '#8b949e',
      light: '#8b949e'
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        position: 'sticky',
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      }
    },
    MuiDivider: {
      defaultProps: {
        style: {
          marginTop: '0.61em',
          marginBottom : '0.61em'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        style: {
          marginTop: '0.5em',
          marginBottom: '0.5em',
        }
      }
    },
    MuiTable: {
      defaultProps: {
        style: {
          background: 'transparent !important',
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        style: {
          color: '#8b949e',
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        style: {
          borderRadius: '3px!important'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        button: {
          color: "#ECEFF1 !important",
          ":hover": { color: "#B9364B !important" },
        }
      },
    },
    MuiTab: {
      defaultProps: {
        style: {
          color: `#fff !important`,
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '12px',
          background: 'black !important',
          color: 'white !important',
          rippleBackgroundColor: 'black !important',
        },
        arrow: {
          color: 'black !important',
          fontColor: 'black !important'
        }
      }
    }
  }
})

export { theme }
