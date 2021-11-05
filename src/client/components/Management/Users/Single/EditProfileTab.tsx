/* eslint-disable camelcase */
import 'moment-timezone'

import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import { Formik } from 'formik'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import AccountBalance from 'src/client/components/Dashboards/Crypto/AccountBalance'
import Label from 'src/client/components/Label'
import Text from 'src/client/components/Text'
import { useUpdateUserMutation } from 'src/client/graphql/updateUser.generated'
import { ThemeContext } from 'src/client/theme/ThemeProvider'
import * as Yup from 'yup'

const ThemeToggleWrapper = styled(Box)(
  ({ theme }) => `
          padding: ${theme.spacing(2)};
          min-width: 220px;
  `
)

const ButtonWrapper = styled(Box)(
  ({ theme }) => `
        cursor: pointer;
        position: relative;
        border-radius: ${theme.general.borderRadiusXl};
        padding: ${theme.spacing(0.8)};
        display: flex;
        flex-direction: row;
        align-items: stretch;
        min-width: 80px;
        box-shadow: 0 0 0 2px ${theme.colors.primary.lighter};

        &:hover {
            box-shadow: 0 0 0 2px ${theme.colors.primary.light};
        }

        &.active {
            box-shadow: 0 0 0 2px ${theme.palette.primary.main};

            .colorSchemeWrapper {
                opacity: .6;
            }
        }
  `
)

const ColorSchemeWrapper = styled(Box)(
  ({ theme }) => `

    position: relative;

    border-radius: ${theme.general.borderRadiusXl};
    height: 28px;
    
    &.colorSchemeWrapper {
        display: flex;
        align-items: stretch;
        width: 100%;

        .primary {
            border-top-left-radius: ${theme.general.borderRadiusXl};
            border-bottom-left-radius: ${theme.general.borderRadiusXl};
        }

        .secondary {
            border-top-right-radius: ${theme.general.borderRadiusXl};
            border-bottom-right-radius: ${theme.general.borderRadiusXl};
        }

        .primary,
        .secondary,
        .alternate {
            flex: 1;
        }
    }

    &.pureLight {
        .primary {
            background: #5569ff;
        }
    
        .secondary {
            background: #f2f5f9;
        }
    }

    &.lightBloom {
        .primary {
            background: #1975FF;
        }
    
        .secondary {
            background: #000C57;
        }
    }

    &.greyGoose {
        .primary {
            background: #2442AF;
        }
    
        .secondary {
            background: #F8F8F8;
        }
    }
    
    &.purpleFlow {
        .primary {
            background: #9b52e1;
        }
    
        .secondary {
            background: #00b795;
        }
    }
    
    &.nebulaFighter {
        .primary {
            background: #8C7CF0;
        }
    
        .secondary {
            background: #070C27;
        }
    }

    &.greenFields {
        .primary {
            background: #44a574;
        }
    
        .secondary {
            background: #141c23;
        }
    }

    &.darkSpaces {
        .primary {
            background: #CB3C1D;
        }
    
        .secondary {
            background: #1C1C1C;
        }
    }

  `
)

const CheckSelected = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.success.main};
    border-radius: 50px;
    height: 26px;
    width: 26px;
    color: ${theme.palette.success.contrastText};
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -13px 0 0 -13px;
    z-index: 5;

    .MuiSvgIcon-root {
        height: 16px;
        width: 16px;
    }

  `
)

function EditProfileTab({ user: puser }) {
  const { t }: { t: any } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const setThemeName = useContext(ThemeContext)
  const [user, setUser] = useState<any>(puser)

  const [open, setOpen] = useState(false)
  const [, updateUser] = useUpdateUserMutation()
  const [theme, setTheme] = useState('PureLightTheme')

  const checkBalance = useCallback(async (ppuser) => {
    if (!window.ethereum?.request) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!provider) return

    const rawBalance = await provider.getBalance(ppuser.address)

    const lbalance = ethers.utils.formatUnits(rawBalance)

    const generatedRawBalance = await provider.getBalance(ppuser.generated)
    const lgeneratedBalance = ethers.utils.formatUnits(generatedRawBalance)

    setUser({ ...ppuser, generatedBalance: lgeneratedBalance, balance: lbalance })
  }, [])

  useEffect(() => {
    checkBalance(puser)

    const curThemeName = window.localStorage.getItem('appTheme') || 'PureLightTheme'
    setTheme(curThemeName)
  }, [checkBalance, puser])

  const changeTheme = (theme): void => {
    setTheme(theme)
    setThemeName(theme)
  }

  const handleCreateUserOpen = () => {
    setOpen(true)
  }

  const handleCreateUserClose = () => {
    setOpen(false)
  }

  const handleCreateUserSuccess = () => {
    enqueueSnackbar(t('The user account was successfully updated'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    })

    setOpen(false)
  }

  const onSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    const luser = user
    try {
      luser.email = _values.email
      luser.name = _values.name

      const { error } = await updateUser({ ...luser })

      if (error) throw new Error(error.message)

      resetForm()
      setStatus({ success: true })
      setSubmitting(false)
      handleCreateUserSuccess()
    } catch (err) {
      console.error(err)
      setStatus({ success: false })
      setErrors({ submit: err.message })
      setSubmitting(false)
      enqueueSnackbar(t('Unexpected error occurred during user update.'), {
        variant: 'error',
      })
    }
  }

  return (
    // <>
    //   {!fetching ? (
    //     <Grid sx={{ py: 10 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
    //       <Grid item>
    //         <CircularProgress color="secondary" size="1rem" />
    //       </Grid>
    //     </Grid>
    //   ) : (
    <>
      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <AccountBalance user={user} />
        </Grid>
        <Grid item lg={8} xs={12}>
          <Card>
            <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t('Addresses')}
                </Typography>
                <Typography variant="subtitle2">{t('Manage details related to your associated addresses')}</Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={5} md={4} textAlign={{ sm: 'right' }}>
                    <Box pr={1} pb={2}>
                      {t('Main address')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7} md={8}>
                    <Text color="black">
                      <Link
                        href={`https://bscscan.com/address/${user.address}`}
                        target="_blank"
                        variant="body2"
                        underline="hover">
                        <b>{user.address}</b>
                      </Link>
                    </Text>
                    <Box pl={1} component="span">
                      <Label color="success">{t('Primary')}</Label>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={5} md={4} textAlign={{ sm: 'right' }}>
                    <Box pr={1} pb={1}>
                      {t('Generated address')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7} md={8}>
                    <Text color="black">
                      <Link
                        href={`https://bscscan.com/address/${user.generated}`}
                        target="_blank"
                        variant="body1"
                        underline="hover">
                        <b>{user.generated}</b>
                      </Link>
                    </Text>
                    {/* <Box pl={1} component="span">
                      <Label color="info">{t('Secondary')}</Label>
                    </Box> */}
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* <Grid item xs={user?.isAdmin ? 12 : 6}> */}
          <Card>
            <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t('Account Settings')}
                </Typography>
                <Typography variant="subtitle2">{t('Manage details related to your account')}</Typography>
              </Box>
              <Button variant="text" onClick={handleCreateUserOpen} startIcon={<EditTwoToneIcon />}>
                {t('Edit')}
              </Button>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Name')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>{user.name}</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Email')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>{user.email}</b>
                    </Text>
                  </Grid>

                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Language')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>English (US)</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Timezone')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>GMT +2</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Registered')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>
                        <Moment format="YYYY/MM/DD - hh:mm:ss">{user.registeredAt}</Moment>
                        {/* {user.registeredAt.toLocaleDateString()} */}
                      </b>
                    </Text>
                  </Grid>

                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Last connexion')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>
                        <Moment format="YYYY/MM/DD - hh:mm:ss">{user.loginAt}</Moment>
                        {/* {user.loginAt.toLocaleDateString()} */}
                      </b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      {t('Account status')}:
                    </Box>
                  </Grid>
                  <Grid item mt={1} xs={12} sm={8} md={9}>
                    <Label color="success">
                      <DoneTwoToneIcon fontSize="small" />
                      <b>{t('Active')}</b>
                    </Label>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ pb: 3 }}>
            <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t('Theme Settings')}
                </Typography>
                <Typography variant="subtitle2">{t('Manage theme colors settings')}</Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
                <ThemeToggleWrapper>
                  <Typography
                    sx={{ mt: 1, mb: 3, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}
                    variant="body1">
                    Light color schemes
                  </Typography>
                  <Stack alignItems="center" spacing={2}>
                    <Tooltip placement="left" title="Pure Light" arrow>
                      <ButtonWrapper
                        className={theme === 'PureLightTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('PureLightTheme')
                        }}>
                        {theme === 'PureLightTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper pureLight">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                    <Tooltip placement="left" title="Light Bloom" arrow>
                      <ButtonWrapper
                        className={theme === 'LightBloomTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('LightBloomTheme')
                        }}>
                        {theme === 'LightBloomTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper lightBloom">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                    <Tooltip placement="left" title="Grey Goose" arrow>
                      <ButtonWrapper
                        className={theme === 'GreyGooseTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('GreyGooseTheme')
                        }}>
                        {theme === 'GreyGooseTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper greyGoose">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                    <Tooltip placement="left" title="Purple Flow" arrow>
                      <ButtonWrapper
                        className={theme === 'PurpleFlowTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('PurpleFlowTheme')
                        }}>
                        {theme === 'PurpleFlowTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper purpleFlow">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                  </Stack>
                </ThemeToggleWrapper>
                <ThemeToggleWrapper>
                  <Typography
                    sx={{ mt: 1, mb: 3, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}
                    variant="body1">
                    Dark color schemes
                  </Typography>
                  <Stack alignItems="center" spacing={2}>
                    <Tooltip placement="left" title="Nebula Fighter" arrow>
                      <ButtonWrapper
                        className={theme === 'NebulaFighterTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('NebulaFighterTheme')
                        }}>
                        {theme === 'NebulaFighterTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper nebulaFighter">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                    <Tooltip placement="left" title="Green Fields" arrow>
                      <ButtonWrapper
                        className={theme === 'GreenFieldsTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('GreenFieldsTheme')
                        }}>
                        {theme === 'GreenFieldsTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper greenFields">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                    <Tooltip placement="left" title="Dark Spaces" arrow>
                      <ButtonWrapper
                        className={theme === 'DarkSpacesTheme' ? 'active' : ''}
                        onClick={() => {
                          changeTheme('DarkSpacesTheme')
                        }}>
                        {theme === 'DarkSpacesTheme' && (
                          <CheckSelected>
                            <CheckTwoToneIcon />
                          </CheckSelected>
                        )}
                        <ColorSchemeWrapper className="colorSchemeWrapper darkSpaces">
                          <Box className="primary" />
                          <Box className="secondary" />
                        </ColorSchemeWrapper>
                      </ButtonWrapper>
                    </Tooltip>
                  </Stack>
                </ThemeToggleWrapper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleCreateUserClose}>
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('Update profil')}
          </Typography>
          <Typography variant="subtitle2">{t('Fill in the fields below to update your profil')}</Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            email: user.email || '',
            name: user.name || '',
            // first_name: '',
            // last_name: '',
            // password: '',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required(t('The name field is required')),
            // first_name: Yup.string().max(255).required(t('The first name field is required')),
            // last_name: Yup.string().max(255).required(t('The last name field is required')),
            email: Yup.string()
              .email(t('The email provided should be a valid email address'))
              .max(255)
              .required(t('The email field is required')),
            // password: Yup.string().max(255).required(t('The password field is required')),
          })}
          onSubmit={onSubmit}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          label={t('Name')}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          variant="outlined"
                        />
                      </Grid>
                      {/* <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.first_name && errors.first_name)}
                          fullWidth
                          helperText={touched.first_name && errors.first_name}
                          label={t('First name')}
                          name="first_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.first_name}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.last_name && errors.last_name)}
                          fullWidth
                          helperText={touched.last_name && errors.last_name}
                          label={t('Last name')}
                          name="last_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.last_name}
                          variant="outlined"
                        />
                      </Grid> */}
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          helperText={touched.email && errors.email}
                          label={t('Email address')}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          margin="normal"
                          helperText={touched.password && errors.password}
                          label={t('Password')}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.password}
                          variant="outlined"
                        />
                      </Grid> */}
                      {/* <Grid item xs={12} md={6}>
                        <Autocomplete
                          disablePortal
                          options={roles}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => <TextField fullWidth {...params} label={t('User role')} />}
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12} lg={5} justifyContent="center">
                    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={3}>
                      <AvatarWrapper>
                        <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
                        <ButtonUploadWrapper>
                          <Input accept="image/*" id="icon-button-file" name="icon-button-file" type="file" />
                          <label htmlFor="icon-button-file">
                            <IconButton component="span" color="primary">
                              <CloudUploadTwoToneIcon />
                            </IconButton>
                          </label>
                        </ButtonUploadWrapper>
                      </AvatarWrapper>
                      <Divider flexItem sx={{ m: 4 }} />
                      <Box display="flex" alignItems="center" flexDirection="column" justifyContent="space-between">
                        <Typography variant="h4" sx={{ pb: 1 }}>
                          {t('Public Profile')}
                        </Typography>
                        <Switch
                          checked={publicProfile.public}
                          onChange={handlePublicProfile}
                          name="public"
                          color="primary"
                        />
                      </Box>
                    </Box>
                  </Grid> */}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button color="secondary" onClick={handleCreateUserClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained">
                  {t('Update profil')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
    //   )}
    // </>
  )
}

EditProfileTab.propTypes = {
  user: PropTypes.shape({
    isAdmin: PropTypes.bool,
    email: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    generated: PropTypes.string,
    registeredAt: PropTypes.string,
    loginAt: PropTypes.string,
    // loginAt: PropTypes.instanceOf(Date),
    // registeredAt: PropTypes.instanceOf(Date),
  }).isRequired,
}

export default EditProfileTab
