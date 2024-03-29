/* eslint-disable */
/// <reference types="react" />
import { SwitchProps as MuiSwitchProps } from '@mui/material/Switch'
import { FieldProps } from 'formik'

export interface SwitchProps
  extends FieldProps,
    Omit<
      MuiSwitchProps,
      'checked' | 'name' | 'value' | 'defaultChecked' | 'form' | 'type'
    > {
  type?: string;
}
export declare function fieldToSwitch({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting },
  type,
  onBlur,
  ...props
}: SwitchProps): MuiSwitchProps;
export declare function Switch(props: SwitchProps): JSX.Element;
export declare namespace Switch {
  var displayName: string;
}
/* eslint-enable */
