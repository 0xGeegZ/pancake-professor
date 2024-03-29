/// <reference types="react" />
import { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { FieldProps } from 'formik';

export interface SelectProps
  extends FieldProps,
    Omit<MuiSelectProps, 'name' | 'value'> {}
export declare function fieldToSelect({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting },
  onBlur,
  ...props
}: SelectProps): MuiSelectProps;
export declare function Select(props: SelectProps): JSX.Element;
export declare namespace Select {
  var displayName: string;
}
