'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var MuiTextField = require('@mui/material/TextField');
var formik = require('formik');
var MuiSwitch = require('@mui/material/Switch');
var invariant = require('tiny-warning');
var MuiCheckbox = require('@mui/material/Checkbox');
var FormControlLabel = require('@mui/material/FormControlLabel');
var MuiSelect = require('@mui/material/Select');
var FormControl = require('@mui/material/FormControl');
var InputLabel = require('@mui/material/InputLabel');
var Input = require('@mui/material/Input');
var FormHelperText = require('@mui/material/FormHelperText');
var MuiRadioGroup = require('@mui/material/RadioGroup');
var MuiInputBase = require('@mui/material/InputBase');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var MuiTextField__default = /*#__PURE__*/_interopDefaultLegacy(MuiTextField);
var MuiSwitch__default = /*#__PURE__*/_interopDefaultLegacy(MuiSwitch);
var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);
var MuiCheckbox__default = /*#__PURE__*/_interopDefaultLegacy(MuiCheckbox);
var FormControlLabel__default = /*#__PURE__*/_interopDefaultLegacy(FormControlLabel);
var MuiSelect__default = /*#__PURE__*/_interopDefaultLegacy(MuiSelect);
var FormControl__default = /*#__PURE__*/_interopDefaultLegacy(FormControl);
var InputLabel__default = /*#__PURE__*/_interopDefaultLegacy(InputLabel);
var Input__default = /*#__PURE__*/_interopDefaultLegacy(Input);
var FormHelperText__default = /*#__PURE__*/_interopDefaultLegacy(FormHelperText);
var MuiRadioGroup__default = /*#__PURE__*/_interopDefaultLegacy(MuiRadioGroup);
var MuiInputBase__default = /*#__PURE__*/_interopDefaultLegacy(MuiInputBase);

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function fieldToTextField(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), _c = _a.form, isSubmitting = _c.isSubmitting, touched = _c.touched, errors = _c.errors, onBlur = _a.onBlur, helperText = _a.helperText, props = __rest(_a, ["disabled", "field", "form", "onBlur", "helperText"]);
    var fieldError = formik.getIn(errors, field.name);
    var showError = formik.getIn(touched, field.name) && !!fieldError;
    return __assign(__assign({ variant: props.variant, error: showError, helperText: showError ? fieldError : helperText, disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function TextField(_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return React__namespace.createElement(MuiTextField__default['default'], __assign({}, fieldToTextField(props)), children);
}
TextField.displayName = 'FormikMaterialUITextField';

function fieldToSwitch(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, type = _a.type, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "type", "onBlur"]);
    if (process.env.NODE_ENV !== 'production') {
        invariant__default['default'](type === 'checkbox', "property type=checkbox is missing from field " + field.name + ", this can caused unexpected behaviour");
    }
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function Switch(props) {
    return React__namespace.createElement(MuiSwitch__default['default'], __assign({}, fieldToSwitch(props)));
}
Switch.displayName = 'FormikMaterialUISwitch';

function fieldToCheckbox(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, type = _a.type, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "type", "onBlur"]);
    var indeterminate = !Array.isArray(field.value) && field.value == null;
    if (process.env.NODE_ENV !== 'production') {
        invariant__default['default'](type === 'checkbox', "property type=checkbox is missing from field " + field.name + ", this can caused unexpected behaviour");
    }
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, indeterminate: indeterminate, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function Checkbox(props) {
    return React__namespace.createElement(MuiCheckbox__default['default'], __assign({}, fieldToCheckbox(props)));
}
Checkbox.displayName = 'FormikMaterialUICheckbox';

function CheckboxWithLabel(_a) {
    var Label = _a.Label, props = __rest(_a, ["Label"]);
    return (React__namespace.createElement(FormControlLabel__default['default'], __assign({ control: React__namespace.createElement(MuiCheckbox__default['default'], __assign({}, fieldToCheckbox(props))) }, Label)));
}
CheckboxWithLabel.displayName = 'FormikMaterialUICheckboxWithLabel';

function fieldToSelect(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "onBlur"]);
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function Select(props) {
    return React__namespace.createElement(MuiSelect__default['default'], __assign({}, fieldToSelect(props)));
}
Select.displayName = 'FormikMaterialUISelect';

var SimpleFileUpload = function (_a) {
    var field = _a.field, _b = _a.form, isSubmitting = _b.isSubmitting, touched = _b.touched, errors = _b.errors, setFieldValue = _b.setFieldValue, label = _a.label, accept = _a.accept, _c = _a.disabled, disabled = _c === void 0 ? false : _c, inputProps = _a.InputProps, inputLabelProps = _a.InputLabelProps, formControlProps = _a.FormControlProps;
    var error = formik.getIn(touched, field.name) && formik.getIn(errors, field.name);
    return (React__namespace.createElement(FormControl__default['default'], __assign({}, formControlProps),
        label && (React__namespace.createElement(InputLabel__default['default'], __assign({ shrink: true, error: !!error }, inputLabelProps), label)),
        React__namespace.createElement(Input__default['default'], __assign({ error: !!error, inputProps: {
                type: 'file',
                accept: accept,
                disabled: disabled || isSubmitting,
                name: field.name,
                onChange: function (event) {
                    if (inputProps === null || inputProps === void 0 ? void 0 : inputProps.onChange) {
                        inputProps.onChange(event);
                    }
                    else {
                        var file = event.currentTarget.files[0];
                        setFieldValue(field.name, file);
                    }
                },
            } }, inputProps)),
        error && React__namespace.createElement(FormHelperText__default['default'], { error: true }, error)));
};

function fieldToRadioGroup(_a) {
    var _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]); _a.form; var onBlur = _a.onBlur, props = __rest(_a, ["field", "form", "onBlur"]);
    return __assign(__assign({ onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function RadioGroup(props) {
    return React__namespace.createElement(MuiRadioGroup__default['default'], __assign({}, fieldToRadioGroup(props)));
}
RadioGroup.displayName = 'FormikMaterialUIRadioGroup';

function fieldToInputBase(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "onBlur"]);
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function InputBase(props) {
    return React__namespace.createElement(MuiInputBase__default['default'], __assign({}, fieldToInputBase(props)));
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
//# sourceMappingURL=main.js.map
