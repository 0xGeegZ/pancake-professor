import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import invariant from 'tiny-warning';
import { __rest, __assign } from './_virtual/_tslib.js';

function fieldToCheckbox(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const { isSubmitting } = _a.form;
  const { type } = _a;
  const { onBlur } = _a;
  const props = __rest(_a, ['disabled', 'field', 'form', 'type', 'onBlur']);
  const indeterminate = !Array.isArray(field.value) && field.value == null;
  if (process.env.NODE_ENV !== 'production') {
    invariant(
      type === 'checkbox',
      `property type=checkbox is missing from field ${field.name}, this can caused unexpected behaviour`
    );
  }
  return __assign(
    __assign(
      {
        disabled:
          disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
        indeterminate,
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
function Checkbox(props) {
  return React.createElement(MuiCheckbox, __assign({}, fieldToCheckbox(props)));
}
Checkbox.displayName = 'FormikMaterialUICheckbox';

export { Checkbox, fieldToCheckbox };
// # sourceMappingURL=Checkbox.js.map
