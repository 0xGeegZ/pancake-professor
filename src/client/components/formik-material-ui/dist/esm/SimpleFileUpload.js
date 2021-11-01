import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import { getIn } from 'formik'
import * as React from 'react'

import { __assign } from './_virtual/_tslib.js'

const SimpleFileUpload = function (_a) {
  const { field } = _a;
  const _b = _a.form;
  const { isSubmitting } = _b;
  const { touched } = _b;
  const { errors } = _b;
  const { setFieldValue } = _b;
  const { label } = _a;
  const { accept } = _a;
  const _c = _a.disabled;
  const disabled = _c === void 0 ? false : _c;
  const inputProps = _a.InputProps;
  const inputLabelProps = _a.InputLabelProps;
  const formControlProps = _a.FormControlProps;
  const error = getIn(touched, field.name) && getIn(errors, field.name);
  return React.createElement(
    FormControl,
    __assign({}, formControlProps),
    label &&
      React.createElement(
        InputLabel,
        __assign({ shrink: true, error: !!error }, inputLabelProps),
        label
      ),
    React.createElement(
      Input,
      __assign(
        {
          error: !!error,
          inputProps: {
            type: 'file',
            accept,
            disabled: disabled || isSubmitting,
            name: field.name,
            onChange(event) {
              if (
                inputProps === null || inputProps === void 0
                  ? void 0
                  : inputProps.onChange
              ) {
                inputProps.onChange(event);
              } else {
                const file = event.currentTarget.files[0];
                setFieldValue(field.name, file);
              }
            },
          },
        },
        inputProps
      )
    ),
    error && React.createElement(FormHelperText, { error: true }, error)
  );
};

export { SimpleFileUpload };
// # sourceMappingURL=SimpleFileUpload.js.map
