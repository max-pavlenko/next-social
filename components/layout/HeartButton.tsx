import { auth, DocumentReference, firestore, increment } from '../../libs/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Button } from '@mui/material';

const HeartButton = ({postRef}: { postRef: DocumentReference }) => {
   const heartsRef = postRef.collection('hearts').doc(auth.currentUser.uid)
   const [ heartDoc ] = useDocument(heartsRef);

   async function removeHeart() {
      const batch = firestore.batch();
      batch.delete(heartsRef);
      batch.update(postRef, {heartsCount: increment(-1)});
      await batch.commit();
   }

   async function addLike() {
      const batch = firestore.batch();
      batch.set(heartsRef, {uid: auth.currentUser.uid})
      batch.update(postRef, {heartsCount: increment(1)})
      await batch.commit();
   }

   return heartDoc?.exists ? (
       <Button variant='outlined' style={{position: 'relative'}} size='large' onClick = {removeHeart}>💔 Unlike</Button>
   ) : (
       <Button variant='contained' size='large' onClick = {addLike}>💕 Like</Button>
   );
};

export default HeartButton;
