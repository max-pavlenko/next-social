import { getUserWithUsername } from '../../utils/helpers';
import { convertToJSON, firestore } from '../../libs/firebase';
import { Typography } from '@mui/material';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { IPost } from '../../models/Post';
import { ParsedUrlQuery } from 'querystring';
import MetaTags from '../../src/shared/components/utils/MetaTags';
import AnimatePage from '../../src/shared/components/utils/AnimatePage';
import PostContent from '../../src/features/posts/components/PostContent';
import AuthCheck from '../../src/features/auth/components/AuthCheck';
import HeartButton from '../../src/features/posts/components/HeartButton';

const UserPost = ({ post, path, username }: { post: IPost, path: string, username: string }) => {
   const postRef = firestore.doc(path);
   const [realtimePost] = useDocumentData(postRef);
   console.log('realtimePost', realtimePost);
   console.log(post, path);
   const usedPost = realtimePost as IPost;


   return (
     <AnimatePage>
        <div>
           {usedPost && (
             <>
                <MetaTags title={`Post ${usedPost.title}`}
                              desc = {`Post ${usedPost.title} by ${username}`}
                              />
                    <main style = {{display: 'flex', gap: '10px'}}>
                          <section style = {{flexGrow: 1}}>
                             <PostContent post = {usedPost}/>
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
                             <b style = {{fontSize: '14px', whiteSpace: 'nowrap'}}>{usedPost.heartsCount || 0} 💕</b>
                          </Typography>
                          <AuthCheck shouldShowAccessText = {false}>
                             <HeartButton postRef = {postRef}/>
                          </AuthCheck>
                       </aside>
                    </main>
                 </>
             )}
          </div>
       </AnimatePage>
   );
};

export default UserPost;

export const getServerSideProps = async ({params}: {params: ParsedUrlQuery & {username: string, slug: string}}) => {
   const {username, slug: postSlug} = params;
   console.log({username, postSlug})
   const userDoc = await getUserWithUsername(username as string);

   let path, post;
   if (userDoc) {
      const postRef = userDoc.ref.collection('posts').doc(postSlug as string);

      post = convertToJSON(await postRef.get());
      path = postRef.path;
   }

   if (!post || !path)
      return {
         notFound: true
      }

   return {
      props: {
         post,
         path,
         username,
      },
   }
}
//
// export const getStaticPaths: GetStaticPaths = async () => {
//    const snapshot = await firestore.collectionGroup('posts').get()
//    const postsPaths = snapshot.docs.map(doc => {
//       const {slug, username} = doc.data()
//       return {
//          params: {slug, username},
//       }
//    });
//
//    return {
//       paths: postsPaths,
//       fallback: 'blocking'
//    }
// }
