import * as React from 'react';
import MuiSelect from '@mui/material/Select';
import { __rest, __assign } from './_virtual/_tslib.js';

function fieldToSelect(_a) {
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
function Select(props) {
  return React.createElement(MuiSelect, __assign({}, fieldToSelect(props)));
}
Select.displayName = 'FormikMaterialUISelect';

export { Select, fieldToSelect };
// # sourceMappingURL=Select.js.map
