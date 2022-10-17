import { useEffect, useRef, useState } from 'react';
import AuthCheck from '../../components/utils/AuthCheck';
import { useRouter } from 'next/router';
import { auth, firestore, serverTimestamp } from '../../libs/firebase';
import styles from '../../styles/Admin.module.scss';
import { useDocumentDataOnce, } from 'react-firebase-hooks/firestore';
import PostFormEdit from '../../components/Forms/PostFormEdit';
import { IPost } from '../../models/Post';
import { Button, Typography } from '@mui/material';
import { toastModal } from '../../utils/toastModal';
import { invertBool } from '../../utils/helpers';
import AnimatePage from '../../components/utils/AnimatePage';

function PostManager() {
   const [ isPreview, setIsPreview ] = useState(false);
   const router = useRouter();
   const {slug} = router.query;
   const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug as string);
   const [ postData ] = useDocumentDataOnce(postRef);
   const post = postData as IPost;
   const user = useRef(null);
   console.log(post, postRef);

   useEffect(() => {
      post && firestore.doc(post.userPath).get().then(snap => {
         user.current = snap.data();
      })
   }, [ post ]);

   function onLinkClick() {
      toastModal('Did you saved the post and wish to continue?', async () => {
             await router.push(`/${user.current.username}/${post.slug}`);
          },
      );
   }

   async function handleEditFormSubmit(title: string, content: string, isPublished: string) {
      await postRef.update({
         title,
         content,
         published: isPublished,
         updatedAt: serverTimestamp(),
      });
   }

   return (

       <main className = {styles.container}>
          {!postRef && <Typography color = 'rebeccapurple'>You dont have permission to proceed.</Typography>}
          {post && (
              <>
                 <section>
                    <PostFormEdit onSubmitEdit = {handleEditFormSubmit} defaultValue = {post}
                                  isPreview = {isPreview}/>
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
       <AnimatePage>
          <AuthCheck>
             <PostManager/>
          </AuthCheck>
       </AnimatePage>
   );
};

export default AdminPostEdit;
