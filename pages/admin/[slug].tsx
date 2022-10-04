import { useEffect, useState } from 'react';
import AuthCheck from '../../components/utils/AuthCheck';
import { useRouter } from 'next/router';
import { auth, firestore } from '../../libs/firebase';
import styles from '../../styles/Admin.module.scss';
import { useDocumentDataOnce, } from 'react-firebase-hooks/firestore';
import PostFormEdit from '../../components/Forms/PostFormEdit';
import { IPost } from '../../models/Post';
import { Button, Typography } from '@mui/material';
import { toastModal } from '../../utils/toastModal';
import { invertBool } from '../../utils/helpers';

function PostManager() {
   const [ isPreview, setIsPreview ] = useState(false);
   const router = useRouter();
   const {slug} = router.query;
   const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug as string);
   const [ postData ] = useDocumentDataOnce(postRef);
   const post = postData as IPost;
   let user;
   console.log(post, postRef);

   useEffect(() => {
     post && firestore.doc(post.userPath).get().then(snap=> {
         user = snap.data();
      })
   }, [post]);

   function onLinkClick(e: any) {
      toastModal('Did you saved the post and wish to continue?', async () => {
             await router.push(`/${user.username}/${post.slug}`);
          },
      );
   }

   return (
       <main className = {styles.container}>
          {!postRef && <Typography color='rebeccapurple'>You dont have permission to proceed.</Typography>}
          {post && (
              <>
                 <section>
                    <PostFormEdit postRef = {postRef} defaultValue = {post} isPreview = {isPreview}/>
                 </section>

                 <aside>
                    <h3>Tools</h3>
                    <Button variant = 'contained' color = 'primary'
                            onClick = {() => setIsPreview(invertBool)}>{isPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button onClick = {onLinkClick} color = 'success' variant = 'outlined'>Live View</Button>
                 </aside>
              </>
          )}

       </main>
   );
}

const AdminPostEdit = () => {

   return (
       <AuthCheck>
          <PostManager/>
       </AuthCheck>
   );
};

export default AdminPostEdit;
