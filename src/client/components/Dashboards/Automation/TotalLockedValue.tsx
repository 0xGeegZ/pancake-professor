import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import { Box, Button, Card, Menu, MenuItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import TotalLockedValueChart from './TotalLockedValueChart'

const TotalLockedValueChartWrapper = styled(TotalLockedValueChart)(
  ({ theme }) => `
        height: 250px;
        margin: ${theme.spacing(0, 3, 0, 1)};
`
)

const AttachMoneyIconWrapper = styled(AttachMoneyIcon)(
  ({ theme }) => `
    color: ${theme.colors.warning.main};
    margin-right: ${theme.spacing(1)};
`
)

function TotalLockedValue() {
  const { t }: { t: any } = useTranslation()

  const power = {
    day: [344, 512, 829, 696, 847, 437, 935, 433],
    week: [2662, 2583, 2746, 4756, 4201, 1869, 5694],
    month: [34471, 37403, 10192, 48243, 37464, 32881, 43357, 40646, 36191, 25000, 10435, 4128],
  }

  const generic = {
    day: ['12:00 AM', '3:00 AM', '6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  }

  const locations = [
    {
      value: 'daily',
      text: t('Daily'),
    },
    {
      value: 'weekly',
      text: t('Weekly'),
    },
    {
      value: 'monthly',
      text: t('Monthly'),
    },
  ]

  const [location, setLocation] = useState<string>(locations[0].text)
  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)

  return (
    <>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">{t('TVL')}</Typography>
        <Box>
          <Button
            color="primary"
            variant="outlined"
            ref={actionRef}
            onClick={() => setOpenMenuLocation(true)}
            endIcon={<ExpandMoreTwoToneIcon />}>
            {location}
          </Button>
          {/* <Tooltip title={t('Advanced statistics')} arrow>
            <IconButton sx={{ ml: 0.5 }} color="primary">
              <KeyboardArrowRightTwoToneIcon />
            </IconButton>
          </Tooltip> */}
        </Box>
        <Menu
          anchorEl={actionRef.current}
          onClose={() => setOpenMenuLocation(false)}
          open={openLocation}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          {locations.map((_location) => (
            <MenuItem
              key={_location.value}
              onClick={() => {
                setLocation(_location.text)
                setOpenMenuLocation(false)
              }}>
              {_location.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Card sx={{ pb: 3 }}>
        <Box display="flex" justifyContent="space-between" p={3} alignItems="center">
          <Box display="flex" alignItems="center">
            <AttachMoneyIconWrapper />
            <Typography variant="h4">{t('Total value locked')}</Typography>
          </Box>
          <Typography fontWeight="bold">{t('+65%')}</Typography>
        </Box>

        {location === 'Daily' && (
          <Box height={250}>
            <TotalLockedValueChartWrapper data={power.day} labels={generic.day} />
          </Box>
        )}
        {location === 'Weekly' && (
          <Box height={250}>
            <TotalLockedValueChartWrapper data={power.week} labels={generic.week} />
          </Box>
        )}
        {location === 'Monthly' && (
          <Box height={250}>
            <TotalLockedValueChartWrapper data={power.month} labels={generic.month} />
          </Box>
        )}
      </Card>
    </>
  )
}

export default TotalLockedValue
