import * as Yup from 'yup';
import type { FC } from 'react';
import { Formik } from 'formik';

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Checkbox,
  Typography,
  Link,
  FormControlLabel,
  CircularProgress
} from '@mui/material';

import useRefMounted from 'src/client/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

const LoginForm: FC = () => {
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();

  return (
    <Formik
      initialValues={{
        email: 'demo@example.com',
        password: 'TokyoPass1@',
        terms: true,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(t('The email provided should be a valid email address'))
          .max(255)
          .required(t('The email field is required')),
        password: Yup.string()
          .max(255)
          .required(t('The password field is required')),
        terms: Yup.boolean().oneOf(
          [true],
          t('You must agree to our terms and conditions')
        )
      })}
      onSubmit={async (_values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.email && errors.email}
            label={t('Email address')}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
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
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.terms}
                  name="terms"
                  color="primary"
                  onChange={handleChange}
                />
              }
              label={
                <>
                  <Typography variant="body2">
                    {t('I accept the')}{' '}
                    <Link component="a" href="#" underline="hover">
                      {t('terms and conditions')}
                    </Link>
                    .
                  </Typography>
                </>
              }
            />
            <Link underline="hover" href="/account/recover-password">
              <b>{t('Lost password?')}</b>
            </Link>
          </Box>

          {Boolean(touched.terms && errors.terms) && (
            <FormHelperText error>{errors.terms}</FormHelperText>
          )}

          <Button
            sx={{ mt: 3 }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            {t('Sign in')}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default LoginForm;
