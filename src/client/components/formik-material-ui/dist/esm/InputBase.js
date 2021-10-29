import * as React from 'react';
import MuiInputBase from '@mui/material/InputBase';
import { __rest, __assign } from './_virtual/_tslib.js';

function fieldToInputBase(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const { isSubmitting } = _a.form;
  const { onBlur } = _a;
  const props = __rest(_a, ['disabled', 'field', 'form', 'onBlur']);
  return __assign(
    __assign(
      {
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
function InputBase(props) {
  return React.createElement(
    MuiInputBase,
    __assign({}, fieldToInputBase(props))
  );
}
InputBase.displayName = 'FormikMaterialUIInputBase';

export { InputBase, fieldToInputBase };
// # sourceMappingURL=InputBase.js.map
