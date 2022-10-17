import { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import ProviderAuthButton from "../utils/ProviderAuthButton";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import FormikInput from "../utils/FormikInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { invertBool } from '../../utils/helpers';
import {
   facebookAuthProvider,
   githubAuthProvider,
   googleAuthProvider,
   logInWithEmail,
   resetPassword,
   signUpWithEmail
} from '../../libs/firebase';
import { toastModal } from '../../utils/toastModal';
import toast from 'react-hot-toast';
import { PROVIDERS_IMAGES, RESET_PASSWORD_COOLDOWN_S } from '../../utils/constants';

export interface ILoggingForm {
   email: string;
   password: string;
}

const LoggingForm = () => {
   const [ showPassword, setShowPassword ] = useState(false)
   const [ isLoggingIn, setIsLoggingIn ] = useState(true);
   const [ resetPasswordCountDown, setResetPasswordCountDown ] = useState(0);

   useEffect(() => {
      if (resetPasswordCountDown<=0) return;
      const timeOutId = setTimeout(() => {
         console.log('resetPasswordCountDown',resetPasswordCountDown);
         setResetPasswordCountDown((prevState) => --prevState)
      }, 1000);
      return () => clearTimeout(timeOutId)
   }, [ resetPasswordCountDown ]);

   async function handleResetPassword(formik: FormikProps<ILoggingForm>) {
      if (formik.errors.email?.length > 0 || Object.keys(formik.touched).length === 0) {
         toast.error('Please, provide valid email!')
         return;
      }
      await resetPassword(formik.values.email);
      setResetPasswordCountDown(RESET_PASSWORD_COOLDOWN_S);
   }

   async function handleLogIn(data: ILoggingForm) {
      const {password, email} = data;
      await logInWithEmail(email, password);
   }

   async function handleSignUp(data: ILoggingForm) {
      const {password, email} = data;
      await signUpWithEmail(email, password);
   }

   async function handleSubmit(data) {
      console.log('isLoggingIn', isLoggingIn)
      isLoggingIn ? await handleLogIn(data) : await handleSignUp(data)
   }

   function handleClickShowPassword() {
      setShowPassword(invertBool);
   }

   function changeLoggingState() {
      setIsLoggingIn(invertBool)
   }

   function handleFormReset(formik: FormikProps<ILoggingForm>) {
      toastModal('Do you want to reset form?', () => {
         formik.resetForm();
      });
   }

   return (
       <Formik
           initialValues = {{
              email: "",
              password: "",
           }}
           validationSchema = {Yup.object({
              email: Yup.string()
                  .email("Enter a valid email")
                  .required("Email is required")
                  .email("Email is has incorrect format"),
              password: Yup.string()
                  .min(6, "Password should be of minimum 6 characters length")
                  .max(30, "Password should be of maximum 30 characters length")
                  .required("Password is required"),
           })}
           onSubmit = {async (values: ILoggingForm, {setSubmitting}: FormikHelpers<ILoggingForm>) => {
              setSubmitting(false);
              await handleSubmit(values);
           }}
       >
          {(formik) => (
              <Form>
                 <Grid container spacing = {3}>
                    <Grid item xs = {12} sm = {6}>
                       <FormikInput
                           props = {{
                              fullWidth: true,
                              type: "email",
                              label: "Email",
                              name: "email",
                              autoComplete: "email",
                           }}
                       />
                    </Grid>
                    <Grid item xs = {12} sm = {6}>
                       <FormikInput
                           props = {{
                              fullWidth: true,
                              type: `${showPassword ? 'text' : 'password'}`,
                              label: "Password",
                              name: "password",
                              InputProps: {
                                 startAdornment: (
                                     <InputAdornment position = "start">
                                        <IconButton
                                            onClick = {handleClickShowPassword}
                                            edge = "end"
                                        >
                                           {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                     </InputAdornment>
                                 ),
                              },
                           }}
                       />
                    </Grid>

                    <Grid sx = {{sm: {flexDirection: 'column'}}} item container gap = {2} alignItems = 'center'
                          justifyContent = "center">
                       <Stack alignItems = 'end' gap = {2}>
                          {isLoggingIn && (
                              <Stack alignItems = 'end'>
                                 <Typography variant = 'subtitle2'>Forgot password?</Typography>
                                 {resetPasswordCountDown === 0 ?
                                     <a tabIndex = {0} onClick = {() => handleResetPassword(formik)}>
                                        <Typography color = 'violet' variant = 'subtitle1'>
                                           Reset it.
                                        </Typography>
                                     </a>
                                     : <Typography >
                                        You can resend reset mail in {resetPasswordCountDown} secs.
                                     </Typography>}
                              </Stack>
                          )}

                          <Button color = "warning" variant = "outlined" onClick = {() => handleFormReset(formik)}>
                             Reset Form
                          </Button>
                       </Stack>

                       <Stack alignItems = 'start' gap = {2}>
                          <Button disabled = {!formik.isValid}
                                  variant = "contained" type = "submit">
                             {isLoggingIn ? 'Log In' : 'Sign Up'}
                          </Button>

                          <Box>
                             <Typography variant = 'subtitle2'>{isLoggingIn ? 'Don\'t' : 'Already'} have an
                                                                                                    account? </Typography>
                             <a onClick = {changeLoggingState} tabIndex = {0}>
                                <Typography color = 'violet' variant = 'subtitle1'>
                                   {isLoggingIn ? 'Sign up' : 'Log in'}.
                                </Typography>
                             </a>
                          </Box>
                       </Stack>
                    </Grid>

                    <Grid justifyContent = "center" container item>
                       <Grid
                           sx = {{display: "flex", alignItems: "center"}}
                           className = "no-padding"
                           item
                           xs = {4}
                       >
                          <div className = "delimeter"></div>
                       </Grid>
                       <Grid className = "no-padding" textAlign = "center" item xs = {2} md = {1}>
                          OR
                       </Grid>
                       <Grid
                           sx = {{display: "flex", alignItems: "center"}}
                           className = "no-padding"
                           item
                           xs = {4}
                       >
                          <div className = "delimeter"></div>
                       </Grid>
                    </Grid>

                    <Grid container justifyContent = "center" gap={2} item xs = {12}>
                       <ProviderAuthButton btnTitle='Google' imgSrc={PROVIDERS_IMAGES.GOOGLE} provider={googleAuthProvider}/>
                       <ProviderAuthButton btnTitle='GitHub' imgSrc={PROVIDERS_IMAGES.GITHUB} provider={githubAuthProvider}/>
                       <ProviderAuthButton btnTitle='Facebook' imgSrc={PROVIDERS_IMAGES.FACEBOOK} provider={facebookAuthProvider}/>
                    </Grid>
                 </Grid>
              </Form>
          )}
       </Formik>
   );
};

export default LoggingForm;
