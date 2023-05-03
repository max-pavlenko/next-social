import { auth, DocumentReference, firestore, increment } from '../../../../libs/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Button } from '@mui/material';

const HeartButton = ({ postRef }: { postRef: DocumentReference }) => {
   const currentUser = auth.currentUser!;
   const heartsRef = postRef.collection('hearts').doc(currentUser.uid);
   const [heartDoc] = useDocument(heartsRef);

   async function removeHeart() {
      const batch = firestore.batch();
      batch.delete(heartsRef);
      batch.update(postRef, { heartsCount: increment(-1) });
      await batch.commit();
   }

   async function addLike() {
      const batch = firestore.batch();
      batch.set(heartsRef, { uid: currentUser.uid });
      batch.update(postRef, { heartsCount: increment(1) });
      await batch.commit();
   }

   return heartDoc?.exists ? (
     <Button variant="outlined" style={{ position: 'relative' }} size="large" onClick={removeHeart}>💔</Button>
   ) : (
     <Button variant="contained" size="large" onClick={addLike}>💕</Button>
   );
};

export default HeartButton;
