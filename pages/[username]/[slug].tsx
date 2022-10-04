import { getUserWithUsername } from '../../utils/helpers';
import { convertToJSON, firestore } from '../../libs/firebase';
import PostContent from '../../components/layout/Posts/PostContent';
import { Container, Typography } from '@mui/material';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import AuthCheck from '../../components/utils/AuthCheck';
import HeartButton from '../../components/layout/HeartButton';
import { IPost } from '../../models/Post';
import { useEffect, useState } from 'react';
import Loader from '../../components/layout/Loader';
import User from '../../store/User';
import MetaTags from '../../components/utils/MetaTags';

const UserPost = ({post, path, username}) => {
   const postRef = firestore.doc(path);
   const [ realtimePost ] = useDocumentData(postRef);
   console.log('realtimePost', realtimePost)
   console.log(post, path);
   const usedPost = realtimePost as IPost;

   return (

       <Container>
          <MetaTags title= {`Post ${usedPost?.title || ''}`} desc={`Post ${usedPost?.title || ''} by ${username}`} imagePath='public/vercel.svg'/>
          <main style = {{display: 'flex', gap: '10px'}}>
             {usedPost as IPost && (
                 <>
                    <section style = {{flexGrow: 1}}>
                       <PostContent post = {usedPost as IPost}/>
                    </section>

                    <aside className = 'card' style = {{
                       alignSelf: 'start',
                       display: 'flex',
                       minWidth: '19%',
                       gap: '10px',
                       flexDirection: 'column',
                       alignItems: 'center',
                       margin: 0
                    }}>
                       <Typography variant = 'caption'>
                          <b style = {{fontSize: '14px'}}>{usedPost.heartsCount || 0} 💕</b>
                       </Typography>
                       <AuthCheck shouldShowAccessText = {false}>
                          <HeartButton postRef = {postRef}/>
                       </AuthCheck>
                    </aside>
                 </>
             )}
          </main>
       </Container>
   );
};

export default UserPost;

export async function getStaticProps({params}) {
   const {username, slug: postSlug} = params;
   console.log({username, postSlug})
   const userDoc = await getUserWithUsername(username);

   let path, post;
   if (userDoc) {
      const postRef = userDoc.ref.collection('posts').doc(postSlug);

      post = convertToJSON(await postRef.get());
      path = postRef.path;
   }

   if (!post || !path)
      return {
         notFound: true
      }

   return {
      props: {
         post: post,
         path: path,
         username
      },
      revalidate: 10,
   }
}

export async function getStaticPaths() {
   const snapshot = await firestore.collectionGroup('posts').get()
   const postsPaths = snapshot.docs.map(doc => {
      const {slug, username} = doc.data()
      return {
         params: {slug, username},
      }
   });

   return {
      paths: postsPaths,
      fallback: 'blocking'
   }
}
