import ArrowDownwardTwoToneIcon from '@mui/icons-material/ArrowDownwardTwoTone'
import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone'
import {
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useTranslation } from 'react-i18next'
import Text from 'src/client/components/Text'

// const AvatarLight = styled(Avatar)(
//   ({ theme }) => `
//       background-color: ${theme.colors.alpha.black[10]};
//       color:  ${theme.colors.alpha.black[100]};
//       font-weight: ${theme.typography.fontWeightBold};
//       font-size: ${theme.typography.pxToRem(15)};
// `
// )

// const DotLegend = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     width: ${theme.spacing(2)};
//     height: ${theme.spacing(2)};
//     display: inline-block;
//     border: ${theme.colors.alpha.white[100]} solid 2px;
// `
// )
// function LiveActivePlayers({ liveUserBettors }) {
function LiveActivePlayers({ userBulls, userBears }) {
  const { t }: { t: any } = useTranslation()
  // const theme = useTheme()

  // const actionRef1 = useRef<any>(null)
  // const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  // const [period, setPeriod] = useState<string>('Select team...')

  // const periods = [
  //   {
  //     value: '1',
  //     text: t('UX Designers'),
  //   },
  //   {
  //     value: '2',
  //     text: t('Frontend Developers'),
  //   },
  //   {
  //     value: '3',
  //     text: t('Team Leaders'),
  //   },
  //   {
  //     value: '4',
  //     text: t('Project Managers'),
  //   },
  // ]

  return (
    <Scrollbars universal autoHide>
      <Card>
        {/* <CardHeader
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
              {period}
            </Button>
            <Menu
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuPeriod(false)}
              open={openPeriod}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}>
              {periods.map((_period) => (
                <MenuItem
                  key={_period.value}
                  onClick={() => {
                    setPeriod(_period.text)
                    setOpenMenuPeriod(false)
                  }}>
                  {_period.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        }
        title={t('LiveActivePlayers')}
      /> */}
        {/* <Divider /> */}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Direction')}</TableCell>
              <TableCell align="center">{t('Player')}</TableCell>
              {/* <TableCell>{t('Total Bets')}</TableCell> */}
              {/* <TableCell align="right">{t('Winrate')}</TableCell> */}
              <TableCell align="right">{t('Amount')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <TableRow hover>
            <TableCell>
              <Box display="flex" alignItems="center">
                <AvatarLight sx={{ mr: 1 }}>1</AvatarLight> 
                <Text color="success">
                  <ArrowUpwardTwoToneIcon />
                </Text>
              </Box>
            </TableCell>
            <TableCell align="center">
              <Box display="flex" alignItems="center">
                <Badge
                  sx={{ mr: 1 }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  overlap="circular"
                  badgeContent={<DotLegend style={{ background: `${theme.colors.success.main}` }} />}>
                   <Avatar src="/static/images/avatars/2.jpg" /> 
                </Badge>
                <Typography variant="h5">Brandon Jonas</Typography>
              </Box>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h4">456</Typography>
            </TableCell>
          </TableRow> */}
            {[].concat(userBulls, userBears).length === 0 ? (
              <Grid sx={{ py: 11 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item>
                  <CircularProgress color="secondary" size="1rem" />
                </Grid>
              </Grid>
            ) : (
              <>
                {[].concat(userBulls, userBears).map((player) => {
                  return (
                    <TableRow hover key={player.address}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {/* <AvatarLight sx={{ mr: 1 }}>1</AvatarLight> */}
                          {player.betBull ? (
                            <>
                              <Text color="success">
                                <ArrowUpwardTwoToneIcon />
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text color="error">
                                <ArrowDownwardTwoToneIcon />
                              </Text>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center">
                          {/* <Badge
                          sx={{ mr: 1 }}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          overlap="circular"
                          badgeContent={<DotLegend style={{ background: `${theme.colors.success.main}` }} />}>
                        </Badge> */}
                          <Link
                            // underline="hover"
                            variant="h5"
                            href={`https://bscscan.com/address/${player.address}`}
                            target="_blank">
                            {/* <Typography variant="subtitle2">{player.address.substring(2, 12)}</Typography> */}
                            {player.address.substring(2, 12)}
                          </Link>
                          {/* <Link variant="h3" underline="none" gutterBottom href="#">
                          <Typography variant="h5"> {player.address.substring(0, 5)}</Typography>
                        </Link> */}
                        </Box>
                      </TableCell>
                      {/* <TableCell>
                        <Typography variant="h4">{player.totalBets}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h4">{player.winRate}</Typography>
                      </TableCell> */}
                      <TableCell align="right">
                        <Typography variant="subtitle2">{parseFloat(player.amount).toFixed(4)}BNB</Typography>
                        {/* <Typography variant="h4">{parseFloat(player.amount).toFixed(4)}BNB</Typography> */}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </>
            )}
          </TableBody>
        </Table>
        {/* {liveUserBettors.length >= 6 ? (
          <> */}
        <Divider />
        <CardActions disableSpacing sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Button disabled={![].concat(userBulls, userBears).length} size="small">
            {t('View all bets for this epoch')}
          </Button>
        </CardActions>
        {/* </>
        ) : (
          <></>
        )} */}
      </Card>
    </Scrollbars>
  )
}

LiveActivePlayers.propTypes = {
  userBulls: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      betBull: PropTypes.bool,
    })
  ).isRequired,
  userBears: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      betBull: PropTypes.bool,
    })
  ).isRequired,
}

export default LiveActivePlayers
