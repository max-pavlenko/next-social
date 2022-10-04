import { IPost } from '../../../models/Post';
import PostItem from './PostItem';

const PostFeed = ({posts, arePostsConfigurable = false}: { posts: IPost[], arePostsConfigurable?: boolean}) => {
    return (
        <>
            {posts?.map(post => <PostItem isConfigurable ={arePostsConfigurable} key={post.uid} post = {post}/>)}
        </>
    );
};

export default PostFeed;
