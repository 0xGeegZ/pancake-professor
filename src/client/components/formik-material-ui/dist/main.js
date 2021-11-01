/* eslint-disable */

Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');
const MuiTextField = require('@mui/material/TextField');
const formik = require('formik');
const MuiSwitch = require('@mui/material/Switch');
const invariant = require('tiny-warning');
const MuiCheckbox = require('@mui/material/Checkbox');
const FormControlLabel = require('@mui/material/FormControlLabel');
const MuiSelect = require('@mui/material/Select');
const FormControl = require('@mui/material/FormControl');
const InputLabel = require('@mui/material/InputLabel');
const Input = require('@mui/material/Input');
const FormHelperText = require('@mui/material/FormHelperText');
const MuiRadioGroup = require('@mui/material/RadioGroup');
const MuiInputBase = require('@mui/material/InputBase');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null);
  if (e) {
    Object.keys(e).forEach((k) => {
      if (k !== 'default') {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get() {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

const React__namespace = /* #__PURE__ */ _interopNamespace(React);
const MuiTextField__default =
  /* #__PURE__ */ _interopDefaultLegacy(MuiTextField);
const MuiSwitch__default = /* #__PURE__ */ _interopDefaultLegacy(MuiSwitch);
const invariant__default = /* #__PURE__ */ _interopDefaultLegacy(invariant);
const MuiCheckbox__default = /* #__PURE__ */ _interopDefaultLegacy(MuiCheckbox);
const FormControlLabel__default =
  /* #__PURE__ */ _interopDefaultLegacy(FormControlLabel);
const MuiSelect__default = /* #__PURE__ */ _interopDefaultLegacy(MuiSelect);
const FormControl__default = /* #__PURE__ */ _interopDefaultLegacy(FormControl);
const InputLabel__default = /* #__PURE__ */ _interopDefaultLegacy(InputLabel);
const Input__default = /* #__PURE__ */ _interopDefaultLegacy(Input);
const FormHelperText__default =
  /* #__PURE__ */ _interopDefaultLegacy(FormHelperText);
const MuiRadioGroup__default =
  /* #__PURE__ */ _interopDefaultLegacy(MuiRadioGroup);
const MuiInputBase__default =
  /* #__PURE__ */ _interopDefaultLegacy(MuiInputBase);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (const p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  const t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === 'function')
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (
        e.indexOf(p[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(s, p[i])
      )
        t[p[i]] = s[p[i]];
    }
  return t;
}

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
  const fieldError = formik.getIn(errors, field.name);
  const showError = formik.getIn(touched, field.name) && !!fieldError;
  return {
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
    ...field,
    ...props,
  };
}
function TextField(_a) {
  const { children } = _a;
  const props = __rest(_a, ['children']);
  return React__namespace.createElement(
    MuiTextField__default.default,
    { ...fieldToTextField(props) },
    children
  );
}
TextField.displayName = 'FormikMaterialUITextField';

function fieldToSwitch(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const { isSubmitting } = _a.form;
  const { type } = _a;
  const { onBlur } = _a;
  const props = __rest(_a, ['disabled', 'field', 'form', 'type', 'onBlur']);
  if (process.env.NODE_ENV !== 'production') {
    invariant__default.default(
      type === 'checkbox',
      `property type=checkbox is missing from field ${field.name}, this can caused unexpected behaviour`
    );
  }
  return {
    disabled:
      disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
    onBlur:
      onBlur !== null && onBlur !== void 0
        ? onBlur
        : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
          },
    ...field,
    ...props,
  };
}
function Switch(props) {
  return React__namespace.createElement(MuiSwitch__default.default, {
    ...fieldToSwitch(props),
  });
}
Switch.displayName = 'FormikMaterialUISwitch';

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
    invariant__default.default(
      type === 'checkbox',
      `property type=checkbox is missing from field ${field.name}, this can caused unexpected behaviour`
    );
  }
  return {
    disabled:
      disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
    indeterminate,
    onBlur:
      onBlur !== null && onBlur !== void 0
        ? onBlur
        : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
          },
    ...field,
    ...props,
  };
}
function Checkbox(props) {
  return React__namespace.createElement(MuiCheckbox__default.default, {
    ...fieldToCheckbox(props),
  });
}
Checkbox.displayName = 'FormikMaterialUICheckbox';

function CheckboxWithLabel(_a) {
  const { Label } = _a;
  const props = __rest(_a, ['Label']);
  return React__namespace.createElement(FormControlLabel__default.default, {
    control: React__namespace.createElement(MuiCheckbox__default.default, {
      ...fieldToCheckbox(props),
    }),
    ...Label,
  });
}
CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel';

function fieldToSelect(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const { isSubmitting } = _a.form;
  const { onBlur } = _a;
  const props = __rest(_a, ['disabled', 'field', 'form', 'onBlur']);
  return {
    disabled:
      disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
    onBlur:
      onBlur !== null && onBlur !== void 0
        ? onBlur
        : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
          },
    ...field,
    ...props,
  };
}
function Select(props) {
  return React__namespace.createElement(MuiSelect__default.default, {
    ...fieldToSelect(props),
  });
}
Select.displayName = 'FormikMaterialUISelect';

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
  const error =
    formik.getIn(touched, field.name) && formik.getIn(errors, field.name);
  return React__namespace.createElement(
    FormControl__default.default,
    { ...formControlProps },
    label &&
      React__namespace.createElement(
        InputLabel__default.default,
        { shrink: true, error: !!error, ...inputLabelProps },
        label
      ),
    React__namespace.createElement(Input__default.default, {
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
      ...inputProps,
    }),
    error &&
      React__namespace.createElement(
        FormHelperText__default.default,
        { error: true },
        error
      )
  );
};

function fieldToRadioGroup(_a) {
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  _a.form;
  const { onBlur } = _a;
  const props = __rest(_a, ['field', 'form', 'onBlur']);
  return {
    onBlur:
      onBlur !== null && onBlur !== void 0
        ? onBlur
        : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
          },
    ...field,
    ...props,
  };
}
function RadioGroup(props) {
  return React__namespace.createElement(MuiRadioGroup__default.default, {
    ...fieldToRadioGroup(props),
  });
}
RadioGroup.displayName = 'FormikMaterialUIRadioGroup';

function fieldToInputBase(_a) {
  const { disabled } = _a;
  const _b = _a.field;
  const fieldOnBlur = _b.onBlur;
  const field = __rest(_b, ['onBlur']);
  const { isSubmitting } = _a.form;
  const { onBlur } = _a;
  const props = __rest(_a, ['disabled', 'field', 'form', 'onBlur']);
  return {
    disabled:
      disabled !== null && disabled !== void 0 ? disabled : isSubmitting,
    onBlur:
      onBlur !== null && onBlur !== void 0
        ? onBlur
        : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
          },
    ...field,
    ...props,
  };
}
function InputBase(props) {
  return React__namespace.createElement(MuiInputBase__default.default, {
    ...fieldToInputBase(props),
  });
}
InputBase.displayName = 'FormikMaterialUIInputBase';

exports.Checkbox = Checkbox;
exports.CheckboxWithLabel = CheckboxWithLabel;
exports.InputBase = InputBase;
exports.RadioGroup = RadioGroup;
exports.Select = Select;
exports.SimpleFileUpload = SimpleFileUpload;
exports.Switch = Switch;
exports.TextField = TextField;
exports.fieldToCheckbox = fieldToCheckbox;
exports.fieldToInputBase = fieldToInputBase;
exports.fieldToRadioGroup = fieldToRadioGroup;
exports.fieldToSelect = fieldToSelect;
exports.fieldToSwitch = fieldToSwitch;
exports.fieldToTextField = fieldToTextField;
// # sourceMappingURL=main.js.map
/* eslint-enable */
