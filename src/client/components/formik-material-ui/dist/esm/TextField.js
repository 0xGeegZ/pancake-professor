import * as React from 'react';
import MuiTextField from '@mui/material/TextField';
import { getIn } from 'formik';
import { __rest, __assign } from './_virtual/_tslib.js';

function fieldToTextField(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const _c = _a.form;
  const { isSubmitting } = _c;
  const { touched } = _c;
  const { errors } = _c;
  const { onBlur } = _a;
  const { helperText } = _a;
  const props = __rest(_a, [
    'disabled',
    'field',
    'form',
    'onBlur',
    'helperText',
  ]);
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;
  return __assign(
    __assign(
      {
        variant: props.variant,
        error: showError,
        helperText: showError ? fieldError : helperText,
        disabled:
          disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
        onBlur:
          onBlur !== null && onBlur !== void 0
            ? onBlur
            : function (e) {
                fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
              },
      },
      field
    ),
    props
  );
}
function TextField(_a) {
  const { children } = _a;
  const props = __rest(_a, ['children']);
  return React.createElement(
    MuiTextField,
    __assign({}, fieldToTextField(props)),
    children
  );
}
TextField.displayName = 'FormikMaterialUITextField';

export { TextField, fieldToTextField };
// # sourceMappingURL=TextField.js.map
