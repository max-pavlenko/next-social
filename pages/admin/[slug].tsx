import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore, serverTimestamp } from '../../libs/firebase';
import styles from '../../styles/Admin.module.scss';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { IPost } from '../../models/Post';
import { Button, Typography } from '@mui/material';
import { toastModal } from '../../src/shared/components/ui/ToastModal';
import { invertBoolState } from '../../utils/helpers';
import { useLocale } from '../../translations/useLocale';
import firebase from 'firebase/compat';
import AnimatePage from '../../src/shared/components/utils/AnimatePage';
import AuthCheck from '../../src/features/auth/components/AuthCheck';
import PostFormEdit, { AdditionalImageData } from '../../src/features/posts/forms/PostFormEdit';
import MetaTags from '../../src/shared/components/utils/MetaTags';
import Loader from '../../src/shared/components/ui/Loader';
import { usePreventUserFromLeavingUnsaved } from '../../libs/hooks/usePreventUserFromLeavingUnsaved';
import DocumentData = firebase.firestore.DocumentData;


const AdminPostEdit = () => {

   return (
     <AnimatePage>
        <AuthCheck>
           <PostManager />
        </AuthCheck>
     </AnimatePage>
   );
};

function PostManager() {
   const [isPreview, setIsPreview] = useState(false);
   const router = useRouter();
   const { slug } = router.query;
   const postRef = firestore.collection('users').doc(auth.currentUser?.uid).collection('posts').doc(slug as string);
   const [postData] = useDocumentDataOnce(postRef);
   const post = postData as IPost;
   const user = useRef<DocumentData | undefined>(undefined);
   const l = useLocale();
   const [areChangesSaved, setAreChangesSaved] = useState(false);
   usePreventUserFromLeavingUnsaved(!areChangesSaved);
   console.log(post, postRef);

   useEffect(() => {
      post && firestore.doc(post.userPath).get().then(snap => {
         user.current = snap.data();
      });
   }, [post]);

   function onLinkClick() {
      toastModal({
         text: 'Did you save the post and wish to continue?',
         onYesClicked: async () => {
            await router.push(`/${user.current?.username}/${post.slug}`);
         },
      });
   }

   async function handleEditFormSubmit(title: string, content: string, isPublished: string, additionalImages: AdditionalImageData[]) {
      const imagesWithoutFiles = additionalImages.map(({ img, id }) => {
         return { img, id };
      });
      console.log('add', imagesWithoutFiles, additionalImages);

      await postRef.update({
         title,
         content,
         published: isPublished,
         updatedAt: serverTimestamp(),
         additionalImages: imagesWithoutFiles,
      });
   }

   return (
     <main className={styles.container}>
        <MetaTags title={`${post && `Editing ${post.title}`}`} desc="" />
        {!postRef && <Typography color="rebeccapurple">{l.noPermission}.</Typography>}
        {post ? (
          <>
             <section>
                <PostFormEdit onSubmitEdit={handleEditFormSubmit} defaultValuePost={post} isPreview={isPreview} />
             </section>

             <aside>
                <h3>{l.tools}</h3>
                <Button variant="contained" color="primary" onClick={() => setIsPreview(invertBoolState)}>
                   {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button onClick={onLinkClick} color="secondary" variant="outlined">{l.liveView}</Button>
             </aside>
          </>
        ) : <Loader />}
     </main>
   );
}

export default AdminPostEdit;
