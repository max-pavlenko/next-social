import { auth, firestore } from '../../libs/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Container } from '@mui/material';
import PostFeed from '../layout/Posts/PostFeed';

const PostList = () => {
   const postsRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
   const query = postsRef.orderBy('createdAt', 'desc');
   const [ querySnapshot ] = useCollection(query);
   const posts = querySnapshot?.docs.map(doc => doc.data()); // see useCollectionData to omit this extra step

   return (
       <>
          <Container>
             <PostFeed arePostsConfigurable ={true} posts = {posts}/>
          </Container>
       </>
   );
}

export default PostList;
