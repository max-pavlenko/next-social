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
import { useLocale } from '../../../translations/useLocale';
import useLessThenMediaQuery from '../../../libs/hooks/useLessThenMediaQuery';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useMenu } from '../../../libs/hooks/useMenu';

function PostItem({post, isConfigurable,}: { post: IPost; isConfigurable: boolean; }) {
   const router = useRouter();
   const postWordCount = post?.content.trim().split(/[\s#*&^]|![alt]\(.*\)+/g).filter(str => str.length > 0).length;
   const minutesToRead = (postWordCount / 100 + 1).toFixed(0);
   const [ username, setUsername ] = useState(post.username);
   const l = useLocale();
   const {isScreenWidthLessThen370, setIsScreenWidthLessThen370} = useLessThenMediaQuery(370);
   const {menuElement, handleClick} = useMenu(<div style={{display: 'flex', paddingInline: '0.2rem'}}>
      <IconButton onClick = {handleEdit}>
         <ModeEditOutlineOutlinedIcon/>
      </IconButton>

      <IconButton onClick = {confirmDeletion}>
         <SvgIcon/>
      </IconButton>
   </div>, {horizontal: 'left', vertical: 'top'});

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

   async function handleMenuCliked(e) {
      e.preventDefault();

   }

   return (
       <Container style={isScreenWidthLessThen370 ? {padding: '1rem'} : {}} className = "card" sx = {{position: "relative"}}>
          <Box style = {{display: "flex", gap: "8px", alignItems: "center"}}>
             <LinkWithoutScroll style = {{display: "flex", gap: "8px", alignItems: "center"}} href = {username}>

                   <CheckmarkIcon style = {{display: 'inline-block'}}/>
                   <span style={{fontStyle: 'italic', fontWeight: '300', fontSize: '15px'}}>{l.postBy} @{username}</span>

             </LinkWithoutScroll>
             {isConfigurable && (
                 <span style = {{marginLeft: "auto"}}>
                 {!isScreenWidthLessThen370
                     ? <>
                        <IconButton onClick = {handleEdit}>
                           <ModeEditOutlineOutlinedIcon/>
                        </IconButton>

                        <IconButton onClick = {confirmDeletion}>
                           <SvgIcon/>
                        </IconButton>
                     </>
                     : <>
                        <IconButton onClick = {handleClick}>
                           <MoreVertOutlinedIcon/>
                        </IconButton>
                        {menuElement}
                     </>
                 }
              </span>
             )}
          </Box>

          <LinkWithoutScroll href = {`${username}/${post.slug}`}>
             <h2 style = {{cursor: "pointer", display: 'inline-block'}}>
                {post.title}
             </h2>
          </LinkWithoutScroll>

          <footer>
        <span style = {{pointerEvents: "none"}}>
          {postWordCount} {l.words}. {l.thats} {minutesToRead} min
           {+minutesToRead === 1 ? "" : "s"}{l.to} {l.read}
        </span>
             <span style={{whiteSpace: 'nowrap'}} className = "push-left">💕 {post.heartsCount}</span>
          </footer>
       </Container>
   );
}

export default PostItem;
