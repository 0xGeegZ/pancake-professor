import * as React from 'react';
import MuiRadioGroup from '@mui/material/RadioGroup';
import { __rest, __assign } from './_virtual/_tslib.js';

function fieldToRadioGroup(_a) {
  /* eslint-disable no-unused-expressions */
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  _a.form;
  const { onBlur } = _a;
  const props = __rest(_a, ['field', 'form', 'onBlur']);
  return __assign(
    __assign(
      {
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
function RadioGroup(props) {
  return React.createElement(
    MuiRadioGroup,
    __assign({}, fieldToRadioGroup(props))
  );
}
RadioGroup.displayName = 'FormikMaterialUIRadioGroup';

export { RadioGroup, fieldToRadioGroup };
// # sourceMappingURL=RadioGroup.js.map
