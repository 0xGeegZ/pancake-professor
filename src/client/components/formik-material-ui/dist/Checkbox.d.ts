/* eslint-disable */
import { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'
import { FieldProps } from 'formik'


/// <reference types="react" />
export interface CheckboxProps
  extends FieldProps,
    Omit<
      MuiCheckboxProps,
      | 'name'
      | 'value'
      | 'error'
      | 'form'
      | 'checked'
      | 'defaultChecked'
      | 'type'
    > {
  type?: string;
}
export declare function fieldToCheckbox({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting },
  type,
  onBlur,
  ...props
}: CheckboxProps): MuiCheckboxProps;
export declare function Checkbox(props: CheckboxProps): JSX.Element;
export declare namespace Checkbox {
  var displayName: string;
}

/* eslint-enable */
