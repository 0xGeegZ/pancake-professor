import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { __rest, __assign } from './_virtual/_tslib.js';
import { fieldToCheckbox } from './Checkbox.js';

function CheckboxWithLabel(_a) {
  const { Label } = _a;
  const props = __rest(_a, ['Label']);
  return React.createElement(
    FormControlLabel,
    __assign(
      {
        control: React.createElement(
          MuiCheckbox,
          __assign({}, fieldToCheckbox(props))
        ),
      },
      Label
    )
  );
}
CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel';

export { CheckboxWithLabel };
// # sourceMappingURL=CheckboxWithLabel.js.map
