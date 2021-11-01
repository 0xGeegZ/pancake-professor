/* eslint-disable */
/// <reference types="react" />
import { FormControlProps } from '@mui/material/FormControl'
import { InputProps } from '@mui/material/Input'
import { InputLabelProps } from '@mui/material/InputLabel'
import { FieldProps } from 'formik'

export interface SimpleFileUploadProps extends FieldProps {
  label: string;
  accept: string;
  disabled?: boolean;
  InputProps?: Omit<InputProps, 'name' | 'type' | 'label'>;
  InputLabelProps?: InputLabelProps;
  FormControlProps?: FormControlProps;
}
export declare const SimpleFileUpload: ({
  field,
  form: { isSubmitting, touched, errors, setFieldValue },
  label,
  accept,
  disabled,
  InputProps: inputProps,
  InputLabelProps: inputLabelProps,
  FormControlProps: formControlProps,
}: SimpleFileUploadProps) => JSX.Element;
/* eslint-enable */
