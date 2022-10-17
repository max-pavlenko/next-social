import AuthCheck from "../../components/utils/AuthCheck";
import PostList from "../../components/utils/PostList";
import CreateNewPostForm from "../../components/Forms/CreatePostForm";
import Loader from "../../components/layout/Loader";
import { Typography } from "@mui/material";
import QuotesBlock from '../../components/layout/PageLayout/QuotesBlock';
import AnimatePage from '../../components/utils/AnimatePage';
import MetaTags from '../../components/utils/MetaTags';

const AdminPostsPage = () => {

   return (
       <AnimatePage>
          <AuthCheck>
             <>
                <MetaTags title='Admin manager' desc='Manage, create and edit your posts' imagePath='' />
                <QuotesBlock Loader = {<Loader/>}/>
                <CreateNewPostForm/>
                <Typography sx = {{mb: '16px'}} variant = 'h3' fontWeight = 'lighter' textAlign = 'center'>
                   Manage your posts
                </Typography>
                <PostList/>
             </>
          </AuthCheck>
       </AnimatePage>
   );
};

export default AdminPostsPage;
