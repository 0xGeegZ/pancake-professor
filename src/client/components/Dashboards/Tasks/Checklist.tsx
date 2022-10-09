import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone'
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone'
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone'
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const TimelineWrapper = styled(Timeline)(
  ({ theme }) => `
    margin-left: ${theme.spacing(2)};

    .MuiTimelineDot-root {
      left: -${theme.spacing(2)};
      margin-top: 0;
      top: ${theme.spacing(0.5)};
    }
    
    .MuiTimelineContent-root {
      padding-left: ${theme.spacing(4)};
    }
    
    .MuiFormControlLabel-root {
      margin-left: -${theme.spacing(0.7)};
    }
    
    .MuiFormControlLabel-label {
      color: ${theme.colors.alpha.black[50]};
    }
`
)

const CheckboxWrapper = styled(Checkbox)(
  ({ theme }) => `
    padding: ${theme.spacing(0.5)};
`
)

function Checklist() {
  const { t }: { t: any } = useTranslation()

  return (
    <Card>
      <CardHeader
        action={
          <Tooltip arrow title={t('Refresh list')}>
            <IconButton size="small" color="primary">
              <RefreshTwoToneIcon />
            </IconButton>
          </Tooltip>
        }
        title={t('Checklist')}
      />
      <CardContent>
        <TimelineWrapper>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <AssignmentTwoToneIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h4" sx={{ pb: 2 }}>
                {t('Tasks Quick List')}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Prepare website launch')}
                />
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Build React Native application')}
                />
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Fix remaining bugs for first 4 pages')}
                />
              </FormGroup>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <AccountTreeTwoToneIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h4" sx={{ pb: 2 }}>
                {t('Project Management')}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Complete sales pitch')}
                />
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Improve SEO visibility')}
                />
              </FormGroup>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <BusinessCenterTwoToneIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h4" sx={{ pb: 2 }}>
                {t('Business & Marketing')}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Create marketing campaign')}
                />
                <FormControlLabel
                  control={<CheckboxWrapper color="primary" name="checkedC" />}
                  label={t('Sign business contract with partners')}
                />
              </FormGroup>
            </TimelineContent>
          </TimelineItem>
        </TimelineWrapper>
      </CardContent>
    </Card>
  )
}

export default Checklist
