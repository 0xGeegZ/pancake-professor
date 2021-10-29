import { ChangeEvent, useState } from 'react'
import { Card, CardContent, CardHeader, Typography, Divider, Tabs, Tab, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import ActivityChart from './ActivityChart'

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
)

const ActivityChartWrapper = styled(ActivityChart)(
  () => `
        height: 260px;
`
)

function Activity() {
  const { t }: { t: any } = useTranslation()

  const [currentTab, setCurrentTab] = useState<string>('weekly')

  const tabs = [
    { value: 'daily', label: t('Daily') },
    { value: 'weekly', label: t('Weekly') },
    { value: 'monthly', label: t('Monthly') },
  ]

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value)
  }

  const calories = {
    day: {
      current: [344, 512, 829, 696, 847, 437, 935, 433, 962],
      previous: [740, 367, 372, 478, 459, 630, 894, 556, 369],
    },
    week: {
      current: [2662, 2583, 2746, 4756, 4201, 1869, 5694],
      previous: [4432, 5917, 5774, 4865, 3638, 4126, 5612],
    },
    month: {
      current: [34471, 37403, 10192, 48243, 37464, 32881, 43357, 40646, 36191, 25000, 10435, 4128],
      previous: [22021, 16157, 11778, 31648, 35923, 28934, 19554, 15607, 28901, 26400, 11091, 44578],
    },
  }

  const generic = {
    day: ['12:00 AM', '3:00 AM', '6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM', '12:00 PM'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <>
            {t('Activity')}{' '}
            <Typography variant="body2" component="span" fontWeight="bold" color="text.secondary">
              ({t('burned calories')})
            </Typography>
          </>
        }
      />
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary">
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>

      <Box p={3} my={2}>
        {currentTab === 'daily' && (
          <Box height={260}>
            <ActivityChartWrapper data={calories.day} labels={generic.day} />
          </Box>
        )}
        {currentTab === 'weekly' && (
          <Box height={260}>
            <ActivityChartWrapper data={calories.week} labels={generic.week} />
          </Box>
        )}
        {currentTab === 'monthly' && (
          <Box height={260}>
            <ActivityChartWrapper data={calories.month} labels={generic.month} />
          </Box>
        )}
      </Box>
    </Card>
  )
}

export default Activity
