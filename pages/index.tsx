import { convertToJSON, firestore } from '../libs/firebase';
import { useEffect, useRef, useState } from 'react';
import PostFeed from '../components/layout/Posts/PostFeed';
import Loader from '../components/layout/Loader';
import { Container, Typography } from '@mui/material';
import { IPost } from '../models/Post';
import { convertPostDateToFBCompatible } from '../utils/helpers';
import MetaTags from '../components/utils/MetaTags';
import { INTERSECTION_MARGIN, POSTS_PER_PAGE } from '../utils/constants';
import { useInView } from 'react-intersection-observer';
import AnimatePage from '../components/utils/AnimatePage';
import DonatePopup from '../components/DonatePopup';

export default function Home({initialPosts}: { initialPosts: IPost[] }) {
   const [ posts, setPosts ] = useState(initialPosts);
   const [ isLoadingNewPosts, setIsLoadingNewPosts ] = useState(false);
   const postsDidEnd = useRef(false);
   const {ref, inView, entry} = useInView({
      rootMargin: `${INTERSECTION_MARGIN}px`
   });

   useEffect(() => { // if in field of vision (so triggers once even when scrolling up)
      if (!entry?.isIntersecting || isLoadingNewPosts) return;
      fetchPosts().then(r => r);
   }, [ inView ]);

   async function fetchPosts() {
      setIsLoadingNewPosts(true);
      const lastPost = posts[posts.length - 1]
      const queryCursor = convertPostDateToFBCompatible(lastPost);

      const query = firestore.collectionGroup('posts')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .startAfter(queryCursor)
          .limit(POSTS_PER_PAGE)

      try {
         const newPosts = (await query.get()).docs.map(doc => doc.data()) as any;
         setPosts((prevPosts) => [ ...prevPosts, ...newPosts ]);
         setIsLoadingNewPosts(false);
         postsDidEnd.current = (POSTS_PER_PAGE !== newPosts.length);
         console.log(postsDidEnd.current);
      } catch (e) {
         console.warn(e)
      }
   }

   return (
       <AnimatePage>
          <DonatePopup/>
          <main style = {{position: 'relative'}}>
             <Typography variant = 'caption'>Try infinite scroll with scroll reload (limit 2)</Typography>
             <MetaTags title = 'Main Page' desc = 'All posts available' imagePath = 'public/vercel.svg'/>
             {posts && <PostFeed posts = {posts}/>}

             {isLoadingNewPosts && <Container>
                 <Loader style = {{position: 'absolute', bottom: '5%', left: '50%', translate: '-50%'}}/>
             </Container>}
             <div style = {{backgroundColor: 'transparent', height: '1px'}} ref = {ref}/>
             {postsDidEnd.current && !isLoadingNewPosts &&
                 <Typography variant = 'h3' textAlign = 'center'>That&apos;s all for now!</Typography>}
          </main>
       </AnimatePage>
   )
}

export async function getServerSideProps() {
   const postsQuery = firestore.collectionGroup('posts')
       .where('published', '==', true)
       .orderBy('createdAt', 'desc')
       .limit(POSTS_PER_PAGE);
   const initialPosts = (await postsQuery.get()).docs.map(convertToJSON)
   return {
      props: {
         initialPosts,
      },
   }
}
