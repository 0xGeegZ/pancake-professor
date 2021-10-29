import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, Alert, Collapse, IconButton, Divider, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { formatDistance, subMinutes } from 'date-fns'
import CloseIcon from '@mui/icons-material/Close'
import ResourcesAlarmChart from './ResourcesAlarmChart'

const CardHeaderWrapper = styled(CardHeader)(
  () => `
    .MuiCardHeader-action {
      align-self: center;
      margin: 0;
    }
`
)

const ResourcesAlarmChartWrapper = styled(ResourcesAlarmChart)(
  () => `
    height: 150px;
`
)

function ResourcesAlarm() {
  const { t }: { t: any } = useTranslation()
  const [open, setOpen] = useState(true)

  const status = {
    month: {
      current: [22, 40, 37, 14, 34, 13, 31, 30, 15, 29, 25, 39, 21, 26, 19, 16, 20, 36, 27, 18],
      previous: [32, 32, 32, 18, 18, 18, 24, 14, 24, 28, 28, 28, 31, 31, 31, 21, 21, 21, 15, 15, 15],
    },
  }

  const month = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
  ]

  return (
    <Card>
      <CardHeaderWrapper
        action={
          <Button variant="contained" size="small">
            {t('Run diagnostics')}
          </Button>
        }
        title={t('Resources Alarm')}
        subheader={
          <>
            {t('Server load snapshot from')}{' '}
            {formatDistance(subMinutes(new Date(), 13), new Date(), {
              addSuffix: true,
            })}
          </>
        }
      />
      <Divider />
      <CardContent>
        <Box height={150}>
          <ResourcesAlarmChartWrapper data={status.month} labels={month} />
        </Box>

        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false)
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity="error">
            {t('Your server is overloaded, fix it as soon as possible!')}
          </Alert>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default ResourcesAlarm
