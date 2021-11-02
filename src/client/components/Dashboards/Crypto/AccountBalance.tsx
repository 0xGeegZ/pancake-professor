import { Box, Button, Card, Grid, Divider, Typography, Tooltip, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import AddFundsForm from 'src/client/components/Dashboards/Automation/AddFundsForm'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import InfoIcon from '@mui/icons-material/Info'
// const AccountBalanceChartWrapper = styled(AccountBalanceChart)(
//   () => `
//       width: 100%;
//       height: 100%;
// `
// )

// const AvatarSuccess = styled(Avatar)(
//   ({ theme }) => `
//       background-color: ${theme.colors.success.main};
//       color: ${theme.palette.success.contrastText};
//       width: ${theme.spacing(8)};
//       height: ${theme.spacing(8)};
//       box-shadow: ${theme.colors.shadows.success};
// `
// )

function AccountBalance({ user }) {
  const { t }: { t: any } = useTranslation()

  const [openForm, setOpenForm] = useState(false)
  const [provider, setProvider] = useState<any>('')

  const handleOpenForm = () => {
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  useEffect(() => {
    if (!window.ethereum?.request) return

    const lprovider = new ethers.providers.Web3Provider(window.ethereum)

    if (!lprovider) return

    setProvider(lprovider)
  }, [])

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12}>
          {openForm ? (
            <>
              <Divider />
              <AddFundsForm handleCloseForm={handleCloseForm} user={user} />
            </>
          ) : (
            <>
              <Box p={4}>
                <Typography sx={{ pb: 1 }} variant="h4">
                  {t('Account Balance')}
                </Typography>
                <Box sx={{ py: 2 }}>
                  <Grid container display="flex" alignItems="center">
                    <Grid item>
                      <Typography variant="h2" gutterBottom>
                        {parseFloat(user?.balance || 0).toFixed(4)} BNB
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Tooltip placement="right-end" title={t('Amount for main address')} arrow>
                        <IconButton color="primary" size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid container display="flex" alignItems="center">
                    <Grid item>
                      <Typography variant="h4" fontWeight="normal" color="text.secondary">
                        - BNB
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Tooltip placement="right-end" title={t('Amount from secondary address')} arrow>
                        <IconButton color="primary" size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2}>
                  <Grid sm item>
                    {+user?.balance === 0 ? (
                      <Tooltip
                        placement="top"
                        title={t('Need to have positive balance in main address to add funds')}
                        arrow>
                        <Button fullWidth variant="outlined" color="warning">
                          {t('Add funds')}
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button disabled={!provider || !user} fullWidth variant="contained" onClick={handleOpenForm}>
                        {t('Add funds')}
                      </Button>
                    )}
                  </Grid>
                  <Grid sm item>
                    {+user?.generatedBalance === 0 ? (
                      <Tooltip
                        placement="top"
                        title={t('Need to have positive balance in secondary address to remoove funds')}
                        arrow>
                        <Button fullWidth variant="outlined" color="warning">
                          {t('Remove funds')}
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button disabled={!provider || !user} fullWidth variant="outlined">
                        {t('Remove funds')}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

AccountBalance.propTypes = {
  user: PropTypes.shape({
    balance: PropTypes.string,
  }),
}

AccountBalance.defaultProps = {
  user: { balance: '0' },
}

export default AccountBalance
