import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

// import { useState } from 'react'
// const Input = styled('input')({
//   display: 'none',
// })

// const AvatarWrapper = styled(Box)(
//   ({ theme }) => `

//     position: relative;

//     .MuiAvatar-root {
//       width: ${theme.spacing(16)};
//       height: ${theme.spacing(16)};
//     }
// `
// )

// const ButtonUploadWrapper = styled(Box)(
//   ({ theme }) => `
//     position: absolute;
//     width: ${theme.spacing(6)};
//     height: ${theme.spacing(6)};
//     bottom: -${theme.spacing(2)};
//     right: -${theme.spacing(2)};

//     .MuiIconButton-root {
//       border-radius: 100%;
//       background: ${theme.colors.primary.main};
//       color: ${theme.palette.primary.contrastText};
//       box-shadow: ${theme.colors.shadows.primary};
//       width: ${theme.spacing(6)};
//       height: ${theme.spacing(6)};
//       padding: 0;

//       &:hover {
//         background: ${theme.colors.primary.dark};
//       }
//     }
// `
// )

// const roles = [
//   { label: 'Administrator', value: 'admin' },
//   { label: 'Subscriber', value: 'subscriber' },
//   { label: 'Customer', value: 'customer' },
// ]

function PageHeader() {
  const { t }: { t: any } = useTranslation()
  // const [open, setOpen] = useState(false)
  // const { enqueueSnackbar } = useSnackbar()
  // const { user } = useAuth();

  // const [publicProfile, setPublicProfile] = useState({
  //   public: true,
  // })

  // const handlePublicProfile = (event) => {
  //   setPublicProfile({
  //     ...publicProfile,
  //     [event.target.name]: event.target.checked,
  //   })
  // }

  // const handleCreateUserOpen = () => {
  //   setOpen(true)
  // }

  // const handleCreateUserClose = () => {
  //   setOpen(false)
  // }

  // const handleCreateUserSuccess = () => {
  //   enqueueSnackbar(t('The user account was created successfully'), {
  //     variant: 'success',
  //     anchorOrigin: {
  //       vertical: 'top',
  //       horizontal: 'right',
  //     },
  //     TransitionComponent: Zoom,
  //   })

  //   setOpen(false)
  // }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Copy best players')}
          </Typography>
          <Typography variant="subtitle2">{t('Choose a player and follow all his actions')}</Typography>
        </Grid>
        {/* <Grid item>
          <Button
            sx={{ mt: { xs: 2, sm: 0 } }}
            onClick={handleCreateUserOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create user')}
          </Button>
        </Grid> */}
      </Grid>
      {/* <Dialog fullWidth maxWidth="md" open={open} onClose={handleCreateUserClose}>
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('Add new user')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Fill in the fields below to create and add a new user to the site')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            email: '',
            username: '',
            first_name: '',
            last_name: '',
            password: '',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().max(255).required(t('The username field is required')),
            first_name: Yup.string().max(255).required(t('The first name field is required')),
            last_name: Yup.string().max(255).required(t('The last name field is required')),
            email: Yup.string()
              .email(t('The email provided should be a valid email address'))
              .max(255)
              .required(t('The email field is required')),
            password: Yup.string().max(255).required(t('The password field is required')),
          })}
          onSubmit={async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              await wait(1000)
              resetForm()
              setStatus({ success: true })
              setSubmitting(false)
              handleCreateUserSuccess()
            } catch (err) {
              console.error(err)
              setStatus({ success: false })
              setErrors({ submit: err.message })
              setSubmitting(false)
            }
          }}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={7}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.username && errors.username)}
                          fullWidth
                          helperText={touched.username && errors.username}
                          label={t('Username')}
                          name="username"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.username}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                      </Grid>
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
                      <Grid item xs={12}>
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
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          disablePortal
                          options={roles}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => <TextField fullWidth {...params} label={t('User role')} />}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={5} justifyContent="center">
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
                  </Grid>
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
                  {t('Add new user')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog> */}
    </>
  )
}

export default PageHeader
