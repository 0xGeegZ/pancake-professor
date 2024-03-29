/* eslint-disable */
/// <reference types="react" />
import { RadioGroupProps as MuiRadioGroupProps } from '@mui/material/RadioGroup'
import { FieldProps } from 'formik'

export interface RadioGroupProps
  extends FieldProps,
    Omit<MuiRadioGroupProps, 'name' | 'value'> {}
export declare function fieldToRadioGroup({
  field: { onBlur: fieldOnBlur, ...field },
  form,
  onBlur,
  ...props
}: RadioGroupProps): MuiRadioGroupProps;
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
export declare namespace RadioGroup {
  var displayName: string;
}
/* eslint-enable */
