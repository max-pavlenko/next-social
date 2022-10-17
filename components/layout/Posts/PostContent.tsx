import { IPost } from '../../../models/Post';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import LinkWithoutScroll from '../../utils/LinkWithoutScroll';

const PostContent = ({post}: { post: IPost }) => {
   console.log(post.createdAt);
   const router = useRouter();
   const {username} = router.query;
   const createdAt = typeof post.createdAt === 'number' ? new Date(post.createdAt) : (post.createdAt as Timestamp).toDate();
   const [ displayDate, setDisplayDate ] = useState('');
   useEffect(() => {
      console.log('createdAt', createdAt)
      setDisplayDate(createdAt.toISOString())
   }, []);

   return (
       <div style = {{margin: '0 auto', maxWidth: '93vw'}} className = 'card'>
          <h1 style = {{margin: 0, borderLeft: '4px solid var(--color-blue)', paddingLeft: '13px'}}>{post.title}</h1>
          <Typography variant = 'caption' className = 'text-sm'>
             Written by&nbsp;
             <LinkWithoutScroll href = {`/${username}`}>
                <a className = 'text-info'>
                   @{username}
                </a>
             </LinkWithoutScroll>
             &nbsp;on {displayDate || 0}
          </Typography>

          <ReactMarkdown>{post?.content}</ReactMarkdown>
       </div>
   );
};

export default PostContent;
