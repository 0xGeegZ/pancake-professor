import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  lighten,
  Link,
  Radio,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
)

const CardLogo = styled('img')(
  ({ theme }) => `
      border: 1px solid ${theme.colors.alpha.black[30]};
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(1)};
      margin-right: ${theme.spacing(2)};
      background: ${theme.colors.alpha.white[100]};
`
)

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        box-shadow: none;
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[100]};
        }
`
)

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.5)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
)

const CardCc = styled(Card)(
  ({ theme }) => `
     border: 1px solid ${theme.colors.alpha.black[30]};
     background: ${theme.colors.alpha.black[5]};
     box-shadow: none;
`
)

function MyCards() {
  const { t }: { t: any } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const data = {
    savedCards: 7,
  }

  const [selectedValue, setSelectedValue] = useState('a')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const handleDelete = () => {
    enqueueSnackbar(t('The card has been removed successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    })
  }

  return (
    <Card>
      <CardHeader subheader={`${data.savedCards} ${t('active strategies')}`} title={t('Active strategies')} />
      <Divider />
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={4}>
            <CardCc sx={{ px: 2, pt: 2, pb: 1 }}>
              <Box display="flex" alignItems="center">
                <CardLogo src="/static/images/placeholders/logo/visa.png" alt="Visa" />
                <Box>
                  <Typography variant="h3" fontWeight="normal">
                    •••• 6879
                  </Typography>
                  <Typography variant="subtitle2">
                    {t('Expires')}:{' '}
                    <Typography component="span" color="text.primary">
                      12/24
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <Box pt={3} display="flex" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                  value="a"
                  control={
                    <Radio
                      checked={selectedValue === 'a'}
                      onChange={handleChange}
                      value="a"
                      color="primary"
                      name="primary-card"
                    />
                  }
                  label={t('Primary')}
                />
                <Tooltip arrow title={t('Remove this card')}>
                  <IconButtonError onClick={() => handleDelete()}>
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButtonError>
                </Tooltip>
              </Box>
            </CardCc>
          </Grid>
          <Grid item xs={6} sm={4}>
            <CardCc sx={{ px: 2, pt: 2, pb: 1 }}>
              <Box display="flex" alignItems="center">
                <CardLogo src="/static/images/placeholders/logo/mastercard.png" alt="Visa" />
                <Box>
                  <Typography variant="h3" fontWeight="normal">
                    •••• 4634
                  </Typography>
                  <Typography variant="subtitle2">
                    {t('Expires')}:{' '}
                    <Typography component="span" color="text.primary">
                      6/22
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <Box pt={3} display="flex" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                  value="b"
                  control={
                    <Radio
                      checked={selectedValue === 'b'}
                      onChange={handleChange}
                      value="b"
                      color="primary"
                      name="primary-card"
                    />
                  }
                  label={t('Primary')}
                />
                <Tooltip arrow title={t('Remove this card')}>
                  <IconButtonError onClick={() => handleDelete()}>
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButtonError>
                </Tooltip>
              </Box>
            </CardCc>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Link href="/app/players" variant="body2" underline="hover">
              <Tooltip arrow title={t('Click to add a new strategie')}>
                <CardAddAction>
                  <CardActionArea sx={{ px: 1 }}>
                    <CardContent>
                      <AvatarAddWrapper>
                        <AddTwoToneIcon fontSize="large" />
                      </AvatarAddWrapper>
                    </CardContent>
                  </CardActionArea>
                </CardAddAction>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default MyCards
