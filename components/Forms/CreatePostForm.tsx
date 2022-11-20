import { observer } from 'mobx-react-lite';
import User from '../../store/User';
import { useState } from 'react';
import { auth, firestore, serverTimestamp } from '../../libs/firebase';
import { Button, Grid, TextField } from '@mui/material';
import { uid } from 'uid';
import { toastNotify } from '../../utils/helpers';
import { IPost } from '../../models/Post';
import { useRouter } from 'next/router';

const kebabCase = require('lodash.kebabcase');

const CreateNewPostForm = observer(() => {
   const {username} = User.user;
   const [ title, setTitle ] = useState('');
   const slug = encodeURI(kebabCase(title));
   const isValid = slug.length > 3 && title.length < 100;
   const router = useRouter();

   async function createPostSubmit(e) {
      e.preventDefault();
      if (!isValid) return;
      const uidUser = auth.currentUser.uid;
      const ref = firestore.collection('users').doc(uidUser).collection('posts').doc(slug);
      const data: IPost = {
         title,
         slug,
         uid: uid(32),
         username,
         published: false,
         content: 'My idea is...',
         createdAt: serverTimestamp() as unknown as Date,
         updatedAt: serverTimestamp() as unknown as Date,
         heartsCount: 0,
         userPath: `users/${uidUser}`,
         additionalImages: [],
      }
      await toastNotify({successText: 'created the post'}, {
         tryFn: async () => {
            await router.push('/admin/' + slug)
            await ref.set(data)
         }
      });
   }

   return (
       <form style={{padding: '20px'}} onSubmit = {createPostSubmit}>
          <Grid container>
             <Grid item xs = {10} mx = 'auto' mt = '10px'>
                <TextField fullWidth value = {title} onChange = {(e) => setTitle(e.target.value)}
                           label = 'My post title'
                           placeholder = {'My amazing title!'}>
                </TextField>
                <p>
                   <strong>Slug: </strong> {slug}
                </p>
             </Grid>
          </Grid>
             <Button type='submit' sx={{display: 'flex', mx: 'auto'}} disabled = {!isValid} variant = 'contained' size = 'large'>
                Create Post
          </Button>
       </form>
   );
});

export default CreateNewPostForm;
