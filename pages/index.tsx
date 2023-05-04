import { convertToJSON, firestore } from '../libs/firebase';
import { useEffect, useRef, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { IPost } from '../models/Post';
import { convertPostDateToFBCompatible } from '../utils/helpers';
import { INTERSECTION_MARGIN, POSTS_PER_PAGE } from '../utils/constants';
import { useInView } from 'react-intersection-observer';
import MetaTags from '../src/shared/components/utils/MetaTags';
import PostFeed from '../src/features/posts/components/PostFeed';
import Loader from '../src/shared/components/ui/Loader';
import Popup from '../src/shared/components/ui/Popup';
import { useRouter } from 'next/router';

export default function Home({ initialPosts }: { initialPosts: IPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const router = useRouter();
  const [isLoadingNewPosts, setIsLoadingNewPosts] = useState(false);
  const postsDidEnd = useRef(false);
  const { ref: loadNewPostRef, inView, entry } = useInView({
    rootMargin: `${INTERSECTION_MARGIN}px`,
  });

  useEffect(() => { // if in field of vision (so triggers once even when scrolling up)
    if (!entry?.isIntersecting || isLoadingNewPosts) return;
    fetchPosts().then(r => r);
  }, [inView]);

  async function fetchPosts() {
    setIsLoadingNewPosts(true);
    const lastPost = posts[posts.length - 1];
    const queryCursor = convertPostDateToFBCompatible(lastPost);

    const query = firestore.collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(queryCursor)
      .limit(POSTS_PER_PAGE);

    try {
      const newPosts = (await query.get()).docs.map(doc => doc.data()) as any;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setIsLoadingNewPosts(false);
      postsDidEnd.current = (POSTS_PER_PAGE !== newPosts.length);
      console.log(postsDidEnd.current);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    // <AnimatePage>
    <>
      <Popup>
        <div className="rainbow" style={{ fontSize: 28, color: 'orchid' }}>❣</div>
        <Button onClick={() => router.push('/donate')} variant="contained">donate</Button>
        <Button onClick={() => router.push('/development')} variant="outlined">🛠</Button>
      </Popup>
      <main style={{ position: 'relative' }}>
        <Typography variant="caption">Try infinite scroll with scroll reload (limit {POSTS_PER_PAGE})</Typography>
        <MetaTags title="Home" desc="Posts & Experience Universe" />
        {posts && <PostFeed posts={posts} />}

        {isLoadingNewPosts && <Container>
          <Loader style={{ position: 'absolute', bottom: '5%', left: '50%', translate: '-50%' }} />
        </Container>}
        <div style={{ backgroundColor: 'transparent', height: '1px' }} ref={loadNewPostRef} />
        {postsDidEnd.current && !isLoadingNewPosts &&
          <Typography variant="h3" textAlign="center">You&apos;re up to date now!</Typography>}
      </main>
    </>
    // </AnimatePage>
  );
}

export async function getServerSideProps() {
  const postsQuery = firestore.collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(POSTS_PER_PAGE);
  const initialPosts = (await postsQuery.get()).docs.map(convertToJSON);
  return {
    props: {
      initialPosts
    }
  };
}
