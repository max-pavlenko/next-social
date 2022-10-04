import { useField } from 'formik';
import { TextField, TextFieldProps } from '@mui/material';

const FormikInput = ({props}: { props: TextFieldProps }) => {
   const [ field, meta ] = useField({...props} as any);
   return (
       <TextField {...props} {...field} error = {meta.touched && !!meta.error}
                  helperText = {(meta.touched && meta.error) || ' '}/>
   );
};

export default FormikInput;
