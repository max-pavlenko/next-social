import { useEffect, useRef, useState } from 'react';
import AuthCheck from '../../components/utils/AuthCheck';
import { useRouter } from 'next/router';
import { auth, firestore, serverTimestamp } from '../../libs/firebase';
import styles from '../../styles/Admin.module.scss';
import { useDocumentDataOnce, } from 'react-firebase-hooks/firestore';
import PostFormEdit, { AdditionalImageData } from '../../components/Forms/PostFormEdit';
import { IPost } from '../../models/Post';
import { Button, Typography } from '@mui/material';
import { toastModal } from '../../utils/toastModal';
import { invertBool } from '../../utils/helpers';
import AnimatePage from '../../components/utils/AnimatePage';
import { useLocale } from '../../translations/useLocale';
import vercel from '../../public/vercel.svg';
import MetaTags from '../../components/utils/MetaTags';

const AdminPostEdit = () => {

   return (
       <AnimatePage>
          <AuthCheck>
             <PostManager/>
          </AuthCheck>
       </AnimatePage>
   );
};

function PostManager() {
   const [ isPreview, setIsPreview ] = useState(false);
   const router = useRouter();
   const {slug} = router.query;
   const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug as string);
   const [ postData ] = useDocumentDataOnce(postRef);
   const post = postData as IPost;
   const user = useRef(null);
   const l = useLocale();
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

   async function handleEditFormSubmit(title: string, content: string, isPublished: string, additionalImages: AdditionalImageData[]) {
      await postRef.update({
         title,
         content,
         published: isPublished,
         updatedAt: serverTimestamp(),
         additionalImages,
      });
   }

   return (
       <main className = {styles.container}>
          <MetaTags title= {`${post && `Editing ${post.title}`}`} desc='' imagePath={vercel} />
          {!postRef && <Typography color = 'rebeccapurple'>{l.noPermission}.</Typography>}
          {post && (
              <>
                 <section>
                    <PostFormEdit onSubmitEdit = {handleEditFormSubmit} defaultValue = {post}
                                  isPreview = {isPreview}/>
                 </section>

                 <aside>
                    <h3>{l.tools}</h3>
                    <Button variant = 'contained' color = 'primary' onClick = {() => setIsPreview(invertBool)}>
                       {isPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button onClick = {onLinkClick} color = 'secondary' variant = 'outlined'>{l.liveView}</Button>
                 </aside>
              </>
          )}
       </main>
   );
}

export default AdminPostEdit;
