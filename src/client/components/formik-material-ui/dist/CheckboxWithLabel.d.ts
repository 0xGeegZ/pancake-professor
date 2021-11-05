/* eslint-disable */
import { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel'
import { FieldProps } from 'formik'

import { CheckboxProps } from './Checkbox'


/// <reference types="react" />
export interface CheckboxWithLabelProps extends FieldProps, CheckboxProps {
  Label: Omit<
    MuiFormControlLabelProps,
    'checked' | 'name' | 'value' | 'control'
  >;
}
export declare function CheckboxWithLabel({
  Label,
  ...props
}: CheckboxWithLabelProps): JSX.Element;
export declare namespace CheckboxWithLabel {
  var displayName: string;
}
/* eslint-enable */
