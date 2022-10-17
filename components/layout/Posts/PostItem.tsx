import { IPost } from "../../../models/Post";
import { Box, Container, IconButton } from "@mui/material";
import { CheckmarkIcon } from "react-hot-toast";
import SvgIcon from "@mui/icons-material/DeleteOutlineSharp";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { auth, firestore } from "../../../libs/firebase";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toastNotify } from '../../../utils/helpers';
import { toastModal } from '../../../utils/toastModal';
import LinkWithoutScroll from '../../utils/LinkWithoutScroll';

function PostItem({post, isConfigurable,}: { post: IPost; isConfigurable: boolean; }) {
   const router = useRouter();
   const postWordCount = post?.content.trim().split(/[\s#*&^]|![alt]\(.*\)+/g).filter(str => str.length > 0).length;
   const minutesToRead = (postWordCount / 100 + 1).toFixed(0);
   const [ username, setUsername ] = useState(post.username);

   useEffect(() => {
      firestore.doc(post.userPath).get().then((snapshot) => {
         setUsername(snapshot.data().username);
         console.log('username', snapshot.data().username);
      })
   }, [post]);

   function confirmDeletion(e) {
      e.preventDefault();
      toastModal('Do you really want to delete the post?', handlePostDelete)
   }

   async function handlePostDelete() {
      const postRef = firestore
          .collection("users")
          .doc(auth.currentUser.uid)
          .collection("posts")
          .doc(post.slug);
      await toastNotify(
          {successText: 'deleted the post'},
          {tryFn: async () => await postRef.delete()})
   }

   async function handleEdit(e) {
      e.preventDefault();
      await router.push(`admin/${post.slug}`)
   }

   return (
       <Container className = "card" sx = {{position: "relative"}}>
          <Box style = {{display: "flex", gap: "8px", alignItems: "center"}}>
             <LinkWithoutScroll href = {username}>
                <a style = {{display: "flex", gap: "8px", alignItems: "center"}}>
                   <CheckmarkIcon style = {{display: 'inline-block'}}/>
                   <b>By @{username}</b>
                </a>
             </LinkWithoutScroll>
             {isConfigurable && (
                 <span style = {{marginLeft: "auto"}}>
                 <IconButton onClick = {handleEdit}>
                    <ModeEditOutlineOutlinedIcon/>
                 </IconButton>

                 <IconButton onClick = {confirmDeletion}>
                    <SvgIcon/>
                 </IconButton>
              </span>
             )}
          </Box>

          <LinkWithoutScroll href = {`${username}/${post.slug}`}>
             <h2 style = {{cursor: "pointer"}}>
                <b>{post.title}</b>
             </h2>
          </LinkWithoutScroll>

          <footer>
        <span style = {{pointerEvents: "none"}}>
          {postWordCount} words. That's {minutesToRead} min
           {+minutesToRead === 1 ? "" : "s"} to read
        </span>
             <span style={{whiteSpace: 'nowrap'}} className = "push-left">💕 {post.heartsCount}</span>
          </footer>
       </Container>
   );
}

export default PostItem;
