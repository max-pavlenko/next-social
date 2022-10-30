import UserProfile from '../../components/layout/PageLayout/UserProfile';
import PostFeed from '../../components/layout/Posts/PostFeed';
import { getUserWithUsername } from '../../utils/helpers';
import { convertToJSON } from '../../libs/firebase';
import MetaTags from '../../components/utils/MetaTags';
import { Typography } from '@mui/material';
import QuotesBlock from '../../components/layout/PageLayout/QuotesBlock';
import Loader from '../../components/layout/Loader';
import { IPost } from '../../models/Post';
import { FirebaseUser } from '../../models/User';
import { observer } from 'mobx-react-lite';
import AnimatePage from '../../components/utils/AnimatePage';

export interface UpdatePasswordForm {
   newPassword: string,
   confirmedPassword: string,
}

const UserProfilePage = observer(({
                                     user,
                                     posts,
                                     realtimePosts
                                  }: { user: FirebaseUser, posts: IPost[], realtimePosts: IPost[] }) => {
  // console.log('----', user, posts, realtimePosts);

   const quoteIdExists = !!user?.favoriteQuoteData?._id;

   return (
       <AnimatePage>
       <main>
          {user && <>
              <MetaTags title = {`${user?.username || 'User Posts'}`} desc = {`Posts - ${(realtimePosts || posts)?.join(', ')}`}
                        imagePath = 'public/vercel.svg'/>
              <UserProfile user = {user}/>
              <div style = {{
                 display: 'flex',
                 justifyContent: 'center',
                 gap: '8px',
                 alignItems: 'center',
                 flexDirection: quoteIdExists ? 'column' : 'row',
                 textAlign: 'center'
              }}>
                  <Typography component = 'span' variant = 'h5'>Favorite quote:</Typography>
                 {quoteIdExists ?
                     <QuotesBlock quoteId = {user.favoriteQuoteData._id} Loader = {<Loader />}/>
                     : <Typography component = 'span' variant = 'h5'>not chosen yet</Typography>
                 }</div>
             {realtimePosts && <PostFeed posts = {realtimePosts}/>}
          </>}
       </main>
          </AnimatePage>
   );
});

export async function getServerSideProps({query}) {
   const {username} = query;

   const userDoc = await getUserWithUsername(username);
   let user = null, posts = null, realtimePosts = null;

   if (userDoc) {
      //user = userDoc.data();
      userDoc.ref.onSnapshot(async (snapshot) => {
         user = snapshot.data();
      });
      const postsQuery = userDoc.ref
          .collection('posts')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(5);

      postsQuery.onSnapshot(snapshot => {
         realtimePosts = snapshot.docs.map(convertToJSON)
      });
      posts = (await postsQuery.get()).docs.map(convertToJSON);


   } else {
      return {
         notFound: true
      }
   }

   return {
      props: {
         posts,
         user,
         realtimePosts
      },
   }
}

export default UserProfilePage;
