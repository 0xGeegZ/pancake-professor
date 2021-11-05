import { Box, Button, Card, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

// const AccountCryptoBalanceChartWrapper = styled(AccountCryptoBalanceChart)(
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

const AccountCryptoBalance = ({ user }) => {
  const { t }: { t: any } = useTranslation()

  // const cryptoBalance = {
  //   datasets: [
  //     {
  //       data: [20, 10, 40, 30],
  //       backgroundColor: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
  //     },
  //   ],
  //   labels: [t('Bitcoin'), t('Ripple'), t('Cardano'), t('Ethereum')],
  // }

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12}>
          <Box p={4}>
            <Typography sx={{ pb: 1 }} variant="h4">
              {t('Account Balance')}
            </Typography>
            <Box sx={{ py: 2 }}>
              <Typography variant="h2" gutterBottom>
                {user.balance} BNB
              </Typography>
              <Typography variant="h4" fontWeight="normal" color="text.secondary">
                - $
              </Typography>
              {/* <Box display="flex" sx={{ py: 2 }} alignItems="center">
                <AvatarSuccess sx={{ mr: 1 }} variant="rounded">
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ $3,594.00</Typography>
                  <Typography variant="subtitle2" noWrap>
                    {t('this month')}
                  </Typography>
                </Box>
              </Box> */}
            </Box>
            <Grid container spacing={3}>
              <Grid sm item>
                <Button fullWidth variant="outlined">
                  {t('Add funds')}
                </Button>
              </Grid>
              <Grid sm item>
                <Button fullWidth variant="contained">
                  {t('Remove funds')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* <Grid
          sx={{ position: 'relative' }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Hidden mdDown>
            <Divider absolute orientation="vertical" />
          </Hidden>
          <Box p={4} flex={1}>
            <Grid container spacing={0}>
              <Grid
                xs={12}
                sm={5}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box style={{ height: '160px' }}>
                  <AccountCryptoBalanceChartWrapper data={cryptoBalance} />
                </Box>
              </Grid>
              <Grid xs={12} sm={7} item display="flex" alignItems="center">
                <List disablePadding sx={{ width: '100%' }}>
                  <ListItem disableGutters>
                    <ListItemAvatar
                      sx={{
                        minWidth: '46px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        alt="BTC"
                        src="/static/images/placeholders/logo/bitcoin.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="BTC"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Bitcoin"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        20%
                      </Typography>
                      <Text color="success">+2.54%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar
                      sx={{
                        minWidth: '46px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        alt="XRP"
                        src="/static/images/placeholders/logo/ripple.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="XRP"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Ripple"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        10%
                      </Typography>
                      <Text color="error">-1.22%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar
                      sx={{
                        minWidth: '46px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        alt="ADA"
                        src="/static/images/placeholders/logo/cardano.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="ADA"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Cardano"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        40%
                      </Typography>
                      <Text color="success">+10.50%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar
                      sx={{
                        minWidth: '46px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        alt="ETH"
                        src="/static/images/placeholders/logo/ethereum.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="ETH"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Ethereum"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        30%
                      </Typography>
                      <Text color="error">-12.38%</Text>
                    </Box>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid> */}
      </Grid>
    </Card>
  )
}

AccountCryptoBalance.propTypes = {
  user: PropTypes.shape({
    balance: PropTypes.number,
  }),
}

AccountCryptoBalance.defaultProps = {
  user: { balance: 0 },
}

export default AccountCryptoBalance
