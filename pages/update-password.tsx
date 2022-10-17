import React, { useState } from 'react';
import AuthCheck from '../components/utils/AuthCheck';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { updatePassword } from '../libs/firebase';
import { Button, Container, Grid, IconButton, InputAdornment } from '@mui/material';
import FormikInput from '../components/utils/FormikInput';
import { UpdatePasswordForm } from './[username]';
import { invertBool, validateSchemaPassword } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AnimatePage from '../components/utils/AnimatePage';

const UpdatePasswordPage = () => {
   const [ isPasswordShown, setIsPasswordShown ] = useState(false);
   return (
       <AnimatePage>
          <AuthCheck>
             <Container>
                <Formik
                    initialValues = {{
                       newPassword: "",
                       confirmedPassword: "",
                    }}
                    validationSchema = {Yup.object({
                       newPassword: validateSchemaPassword('New'),
                       confirmedPassword: validateSchemaPassword('Confirmed'),
                    })}
                    onSubmit = {async (values: UpdatePasswordForm, {setSubmitting}: FormikHelpers<UpdatePasswordForm>) => {
                       setSubmitting(false);
                       values.newPassword === values.confirmedPassword ? await updatePassword(values.newPassword) :
                           toast.error('Passwords must be equal!');
                    }}
                >
                   {(formik) => (
                       <Form>
                          <Grid container spacing = {3}>
                             <Grid item xs = {12} sm = {6}>
                                <FormikInput
                                    props = {{
                                       fullWidth: true,
                                       type: `${isPasswordShown ? 'text' : 'password'}`,
                                       label: "New Password",
                                       name: "newPassword",
                                       autoComplete: "password",
                                       InputProps: {
                                          endAdornment: (
                                              <InputAdornment position = "end">
                                                 <IconButton
                                                     onClick = {() => setIsPasswordShown(invertBool)}
                                                     edge = "end"
                                                 >
                                                    {isPasswordShown ? <VisibilityOff/> : <Visibility/>}
                                                 </IconButton>
                                              </InputAdornment>
                                          ),
                                       },
                                    }}
                                />
                             </Grid>
                             <Grid item xs = {12} sm = {6}>
                                <FormikInput
                                    props = {{
                                       fullWidth: true,
                                       type: "password",
                                       label: "Confirmed Password",
                                       name: "confirmedPassword",
                                    }}
                                />
                             </Grid>
                             <Grid item container justifyContent = 'center' xs = {12}>
                                <Button type = 'submit' variant = 'contained'>Submit</Button>
                             </Grid>
                          </Grid>
                       </Form>
                   )}
                </Formik>
             </Container>
          </AuthCheck>
       </AnimatePage>
   );
};

export default UpdatePasswordPage;
