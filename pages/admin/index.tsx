import { Typography } from '@mui/material';
import { useLocale } from '../../translations/useLocale';
import AuthCheck from '../../src/features/auth/components/AuthCheck';
import AnimatePage from '../../src/shared/components/utils/AnimatePage';
import MetaTags from '../../src/shared/components/utils/MetaTags';
import QuotesBlock from '../../src/shared/components/widgets/QuotesBlock';
import Loader from '../../src/shared/components/ui/Loader';
import CreateNewPostForm from '../../src/features/posts/forms/CreatePostForm';
import PostList from '../../src/features/posts/components/PostList';

const AdminPostsPage = () => {
   const l = useLocale();

   return (
     <AnimatePage>
        <AuthCheck>
           <>
              <MetaTags title={l.managePosts} desc="Manage, create and edit your posts" />
              <QuotesBlock Loader={<Loader />} />
              <CreateNewPostForm />
              <Typography sx={{ mb: '16px' }} variant="h3" fontWeight="lighter" textAlign="center">
                 {l.managePosts}
              </Typography>
              <PostList />
           </>
        </AuthCheck>
     </AnimatePage>
   );
};

export default AdminPostsPage;
