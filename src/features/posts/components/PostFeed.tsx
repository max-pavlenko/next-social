import { IPost } from '../../../../models/Post';
import PostItem from './PostItem';
import { FC } from 'react';

type Props = { posts: IPost[], arePostsConfigurable?: boolean }

const PostFeed: FC<Props> = ({ posts, arePostsConfigurable = false }) => {
   return (
     <>
        {posts?.map(post => <PostItem isConfigurable={arePostsConfigurable} key={post.uid} post={post} />)}
     </>
   );
};

export default PostFeed;
