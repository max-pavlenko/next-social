import { useCallback, useEffect, useState } from 'react';
import User from '../../store/User';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { firestore } from '../../libs/firebase';
import UsernameMessage from '../utils/UsernameMessage';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import ImageUploader from '../layout/ImageUploader';
import { UsernameFormModes } from '../../models/Form';
import toast from 'react-hot-toast';
import Entered from '../utils/Entered';
import Image from 'next/image';
import { downloadFile } from '../../utils/helpers';

const debounce = require('lodash.debounce');

const UsernameForm = observer(({
                                  onSubmit = () => {
                                  }, mode = UsernameFormModes.CREATE
                               }:
                                   { onSubmit?: () => void, mode?: UsernameFormModes }) => {
   const [ isLoading, setIsLoading ] = useState(false);
   const [ isValid, setIsValid ] = useState(false);
   const {displayName, uid} = User.user.data;
   const {photoURL, user: {username}} = User;
   const router = useRouter();
   let photoURLBlob;
   const isntPhotoURL = !photoURL?.startsWith('http')
   isntPhotoURL && fetch(photoURL).then(res => res.blob()).then(blob => photoURLBlob = blob);
   const [ enteredName, setEnteredName ] = useState(username || displayName);

   useEffect(() => {
      checkUsername(enteredName);
   }, [ enteredName ]);

   async function handleUsernameSubmit(e) {
      e.preventDefault();
      if (!isValid) return;

      const batch = firestore.batch();
      const userDoc = firestore.doc(`users/${uid}`);
      const usernameDoc = firestore.doc(`usernames/${enteredName}`);
      onSubmit();
      if (mode === UsernameFormModes.UPDATE) {
         batch.update(userDoc, {username: enteredName, photoURL, displayName: enteredName});
         batch.delete(firestore.doc(`usernames/${username}`));
      } else {
         batch.set(userDoc, {username: enteredName, photoURL, displayName: enteredName});
      }
      batch.set(usernameDoc, {uid});

      try {
         await batch.commit();
         await router.push('/' + enteredName);
         mode === UsernameFormModes.UPDATE && toast.success('Successfully updated user info!')
      } catch (e) {
         console.log(e)
      }
   }

   function handleNameChange(e) {
      const targetValue = e.target.value;
      const inputVal = targetValue.toLowerCase().trim();
      const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

      if (inputVal.length <= 3 || regex.test(inputVal)) {
         setIsValid(false)
      }

      setIsLoading(true)
      setEnteredName(targetValue);
   }

   const checkUsername = useCallback(debounce(async (username) => {
      if (!username) return;

      if (username.length < 3) {
         setIsLoading(false);
         return;
      }
      try {
         const ref = firestore.doc(`usernames/${username}`)
         const {exists} = await ref.get()
         setIsLoading(false);
         setIsValid(!exists);
      } catch (e) {
         console.log(e)
      }
   }, 400), []);

   function handleDownloadImage(fileUrl: string, fileName: string, fileBlob: Blob) {
      console.log('photoURLBlob', fileBlob)
      downloadFile('image', fileBlob)
   }

   return <form onSubmit = {handleUsernameSubmit}>
      <Grid container spacing = {3}>
         <Grid mx = 'auto' style = {{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
         }} item container gap = {1} xs = {12} sm = {6}>
            <TextField fullWidth autoComplete = "nickname" label = 'Username' value = {enteredName || ''}
                       onChange = {handleNameChange} helperText = 'Dont use your real name'/>
            <Button disabled = {!isValid} type = 'submit' variant = 'contained' color = 'success'>Submit</Button>
            <UsernameMessage isValid = {isValid} username = {enteredName} loading = {isLoading}/>
            {mode === UsernameFormModes.CREATE && <Entered/>}
         </Grid>
      </Grid>
      <ImageUploader shouldShowImgURL = {false}/>
      {photoURL &&
          <Stack sx={{alignItems: 'center'}}>
              <div><Image height = {250} width = {250} style = {{margin: '0 auto', objectFit: 'cover'}} src = {photoURL} alt = 'Preview user avatar'/>
              </div>
             {isntPhotoURL && <Button sx = {{mt: 2}} onClick = {() => handleDownloadImage(photoURL, 'name', photoURLBlob)}
                      variant = 'outlined'>
                Download image
             </Button>}
          </Stack>
      }
   </form>
});

export default UsernameForm;
