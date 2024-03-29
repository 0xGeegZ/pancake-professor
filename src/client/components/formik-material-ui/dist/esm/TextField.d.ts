/// <reference types="react" />
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { FieldProps } from 'formik';

export interface TextFieldProps
  extends FieldProps,
    Omit<MuiTextFieldProps, 'name' | 'value' | 'error'> {}
export declare function fieldToTextField({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting, touched, errors },
  onBlur,
  helperText,
  ...props
}: TextFieldProps): MuiTextFieldProps;
export declare function TextField({
  children,
  ...props
}: TextFieldProps): JSX.Element;
export declare namespace TextField {
  var displayName: string;
}
