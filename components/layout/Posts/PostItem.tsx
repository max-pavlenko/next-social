import {IPost} from "../../../models/Post";
import {Box, Container, IconButton} from "@mui/material";
import {CheckmarkIcon} from "react-hot-toast";
import DeleteOutlineSharp from "@mui/icons-material/DeleteOutlineSharp";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import {auth, firestore} from "../../../libs/firebase";
import {useRouter} from 'next/router';
import {MouseEventHandler, useEffect, useState} from 'react';
import {toastNotify} from '../../../utils/helpers';
import {toastModal} from '../../../utils/toastModal';
import LinkWithoutScroll from '../../utils/LinkWithoutScroll';
import {useLocale} from '../../../translations/useLocale';
import useLessThenMediaQuery from '../../../libs/hooks/useLessThenMediaQuery';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import {useMenu} from '../../../libs/hooks/useMenu';
import {motion} from "framer-motion";
import {observer} from "mobx-react-lite";
import User from "../../../store/User";

function PostItem({post, isConfigurable,}: { post: IPost; isConfigurable: boolean; }) {
   const router = useRouter();
   const postWordCount = post?.content.trim().split(/[\s#*&^]|![alt]\(.*\)+/g).filter(str => str.length > 0).length;
   const minutesToRead = (postWordCount / 100 + 1).toFixed(0);
   const [ username, setUsername ] = useState(post.username);
   const l = useLocale();
   const {isScreenWidthLessThen370} = useLessThenMediaQuery(370);
   const {user: {lightMode}} = User;
    console.log('dark md', lightMode)

   const handleEdit: MouseEventHandler<HTMLButtonElement> = async(ev) => {
      const e = ev as unknown as MouseEvent;
      e.preventDefault();
      await router.push(`admin/${post.slug}`)
   }
   const {menuElement, handleClick} = useMenu(<div style={{display: 'flex', paddingInline: '0.2rem'}}>
      <IconButton onClick = {handleEdit}>
         <ModeEditOutlineOutlinedIcon/>
      </IconButton>

      <IconButton onClick = {confirmDeletion}>
         <DeleteOutlineSharp/>
      </IconButton>
   </div>, {horizontal: 'left', vertical: 'top'});

   useEffect(() => {
      firestore.doc(post.userPath).get().then((snapshot) => {
         setUsername(snapshot.data()?.username);
         console.log('username', snapshot.data()?.username);
      })
   }, [post]);

   function confirmDeletion(e) {
      e.preventDefault();
      toastModal('Do you really want to delete the post?', handlePostDelete)
   }

   async function handlePostDelete() {
      const postRef = firestore
          .collection("users")
          .doc(auth.currentUser?.uid)
          .collection("posts")
          .doc(post.slug);
      await toastNotify(
          {successText: 'deleted the post'},
          {tryFn: async () => await postRef.delete()})
   }

    const variants = {
        hidden: { opacity: -1, x: 50, y: 0 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -50, y: 0 },
    }

   return (
       <motion.div whileInView='enter'
                   variants = {variants}
                   viewport={{once: false, amount: 0.2}}
                   initial="hidden"
                   exit='exit'
                   transition={{type: 'tween', duration: 0.2, }}>
           <Container style={isScreenWidthLessThen370 ? {padding: '1rem'} : {}} className="card"
                              sx={{position: "relative"}}>
           <Box style={{display: "flex", gap: "8px", alignItems: "center"}}>
               <LinkWithoutScroll style={{display: "flex", gap: "8px", alignItems: "center"}} href={username || '/'}>

                   <CheckmarkIcon style={{display: 'inline-block'}}/>
                   <span
                       style={{fontStyle: 'italic', fontWeight: '300', fontSize: '15px'}}>{l.postBy} @{username}</span>

               </LinkWithoutScroll>
               {isConfigurable && (
                   <span style={{marginLeft: "auto"}}>
                 {!isScreenWidthLessThen370
                     ? <>
                         <IconButton  onClick={handleEdit}>
                             <ModeEditOutlineOutlinedIcon/>
                         </IconButton>

                         <IconButton onClick={confirmDeletion}>
                             <DeleteOutlineSharp/>
                         </IconButton>
                     </>
                     : <>
                         <IconButton onClick={handleClick}>
                             <MoreVertOutlinedIcon/>
                         </IconButton>
                         {menuElement}
                     </>
                 }
              </span>
               )}
           </Box>

           <LinkWithoutScroll href={`${username}/${post.slug}`}>
               <h2 style={{cursor: "pointer", display: 'inline-block'}}>
                   {post.title}
               </h2>
           </LinkWithoutScroll>

           <footer>
        <span style={{pointerEvents: "none"}}>
          {postWordCount} {l.words}. {l.thats} {minutesToRead} min
            {+minutesToRead === 1 ? "" : "s"}{l.to} {l.read}
        </span>
               <span style={{whiteSpace: 'nowrap'}} className="push-left">💕 {post.heartsCount}</span>
           </footer>
       </Container>
       </motion.div>
   );
}

export default observer(PostItem);
