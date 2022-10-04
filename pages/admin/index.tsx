import AuthCheck from "../../components/utils/AuthCheck";
import PostList from "../../components/utils/PostList";
import CreateNewPostForm from "../../components/Forms/CreatePostForm";
import Loader from "../../components/layout/Loader";
import { Typography } from "@mui/material";
import QuotesBlock from '../../components/layout/PageLayout/QuotesBlock';

const AdminPostsPage = () => {


  return (
    <AuthCheck>
      <>
        <QuotesBlock Loader={<Loader/>}/>

        <CreateNewPostForm />
        <Typography sx={{mb: '16px'}} variant = 'h3' fontWeight = 'lighter' textAlign = 'center'>
          Manage your posts
        </Typography>
        <PostList />
      </>
    </AuthCheck>
  );
};

export default AdminPostsPage;
