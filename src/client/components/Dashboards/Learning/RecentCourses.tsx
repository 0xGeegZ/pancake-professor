import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone'
import PendingTwoToneIcon from '@mui/icons-material/PendingTwoTone'
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from 'src/client/components/Text'

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
)

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
)

const AvatarInfo = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.info.lighter};
      color: ${theme.colors.info.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
)

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
      margin: ${theme.spacing(4)} auto 0;
      display: block;
`
)

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
      color: ${theme.colors.alpha.black[70]};
      
      &:hover {
        color: ${theme.colors.alpha.black[100]};
      }
`
)

function RecentCourses() {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = () => {
    enqueueSnackbar(t('You clicked on delete!'), {
      variant: 'error',
    })
  }

  const handleClick = () => {
    enqueueSnackbar(t('You clicked on the chip!'), {
      variant: 'success',
    })
  }

  const [currentTab, setCurrentTab] = useState<string>('all')

  const tabs = [
    { value: 'all', label: t('All Courses') },
    { value: 'active', label: t('Active') },
    { value: 'upcoming', label: t('Upcoming') },
  ]

  const handleTabsChange = (_event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value)
  }

  return (
    <Card>
      <CardHeader title={t('Recent Courses')} />
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
      <Divider />

      {currentTab === 'all' && (
        <>
          <List disablePadding>
            <ListItem sx={{ display: { xs: 'block', md: 'flex' }, py: 3 }}>
              <ListItemAvatar sx={{ mr: 2 }}>
                <Link
                  underline="none"
                  sx={{
                    transition: 'all .2s',
                    opacity: 1,
                    '&:hover': { opacity: 0.8 },
                  }}
                  href="#">
                  <img src="/static/images/placeholders/fitness/1.jpg" alt="..." />
                </Link>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Box sx={{ pb: 1 }}>
                      <Chip
                        sx={{ mr: 1 }}
                        size="small"
                        label={t('Software')}
                        color="secondary"
                        onClick={handleClick}
                        onDelete={handleDelete}
                      />
                      <Chip
                        sx={{ mr: 1 }}
                        size="small"
                        label={t('Development')}
                        color="secondary"
                        onClick={handleClick}
                        onDelete={handleDelete}
                      />
                      <Chip
                        sx={{ mr: 1 }}
                        size="small"
                        label={t('AML')}
                        color="secondary"
                        onClick={handleClick}
                        onDelete={handleDelete}
                      />
                    </Box>
                    <Link underline="none" sx={{ '&:hover': { color: theme.colors.primary.dark } }} href="#">
                      Machine learning basics: Regression
                    </Link>
                  </>
                }
                primaryTypographyProps={{ variant: 'h3' }}
                secondary={
                  <>
                    March 14, 2021 - March 28, 2021
                    <Box display="flex" alignItems="center" sx={{ pt: 1 }}>
                      <AvatarInfo>
                        <TimerTwoToneIcon />
                      </AvatarInfo>
                      <Text color="info">
                        <b>{t('In Progress')}</b>
                      </Text>
                    </Box>
                  </>
                }
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  sx: { pt: 1 },
                }}
              />
              <Box sx={{ my: { xs: 2, md: 0 } }} display="flex" alignItems="center" justifyContent="flex-right">
                <Box display="flex" alignItems="center">
                  <Text color="warning">
                    <LocalFireDepartmentTwoToneIcon />
                  </Text>
                  <b>9.2</b>
                </Box>
                <Button sx={{ mx: 2 }} variant="outlined" size="small">
                  View course
                </Button>
                <IconButtonWrapper size="small" color="secondary">
                  <PendingTwoToneIcon />
                </IconButtonWrapper>
              </Box>
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ display: { xs: 'block', md: 'flex' }, py: 3 }}>
              <ListItemAvatar sx={{ mr: 2 }}>
                <Link
                  underline="none"
                  sx={{
                    transition: 'all .2s',
                    opacity: 1,
                    '&:hover': { opacity: 0.8 },
                  }}
                  href="#">
                  <img src="/static/images/placeholders/fitness/2.jpg" alt="..." />
                </Link>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Box sx={{ pb: 1 }}>
                      <Chip
                        sx={{ mr: 1 }}
                        size="small"
                        label={t('Dev Tools')}
                        color="secondary"
                        onClick={handleClick}
                        onDelete={handleDelete}
                      />
                      <Chip
                        sx={{ mr: 1 }}
                        size="small"
                        label={t('Frontend')}
                        color="secondary"
                        onClick={handleClick}
                        onDelete={handleDelete}
                      />
                    </Box>
                    <Link underline="none" sx={{ '&:hover': { color: theme.colors.primary.dark } }} href="#">
                      Project Management: Managing Front-End Planning
                    </Link>
                  </>
                }
                primaryTypographyProps={{ variant: 'h3' }}
                secondary={
                  <>
                    April 5, 2021 - April 12, 2021
                    <Box display="flex" alignItems="center" sx={{ pt: 1 }}>
                      <AvatarSuccess>
                        <CheckTwoToneIcon />
                      </AvatarSuccess>
                      <Text color="success">
                        <b>{t('Completed')}</b>
                      </Text>
                    </Box>
                  </>
                }
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  sx: { pt: 1 },
                }}
              />
              <Box sx={{ my: { xs: 2, md: 0 } }} display="flex" alignItems="center" justifyContent="flex-right">
                <Box display="flex" alignItems="center">
                  <Text color="warning">
                    <LocalFireDepartmentTwoToneIcon />
                  </Text>
                  <b>9.2</b>
                </Box>
                <Button sx={{ mx: 2 }} variant="contained" size="small">
                  Get your certificate
                </Button>
                <IconButtonWrapper size="small" color="secondary">
                  <PendingTwoToneIcon />
                </IconButtonWrapper>
              </Box>
            </ListItem>
            <Divider component="li" />
          </List>
          <CardActions disableSpacing sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination size="large" count={7} color="primary" />
          </CardActions>
        </>
      )}

      {currentTab === 'active' && (
        <>
          <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

          <Typography
            align="center"
            variant="h2"
            fontWeight="normal"
            color="text.secondary"
            sx={{ py: 4, mb: 3 }}
            gutterBottom>
            {t('There are no active courses!')}
          </Typography>
        </>
      )}

      {currentTab === 'upcoming' && (
        <>
          <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

          <Typography
            align="center"
            variant="h2"
            fontWeight="normal"
            color="text.secondary"
            sx={{ py: 4, mb: 3 }}
            gutterBottom>
            {t('There are no upcoming courses!')}
          </Typography>
        </>
      )}
    </Card>
  )
}

export default RecentCourses
