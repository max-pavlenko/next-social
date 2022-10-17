import { Container, IconButton } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import UsernameForm from '../../Forms/UsernameForm';
import { invertBool } from '../../../utils/helpers';
import { UsernameFormModes } from '../../../models/Form';
import { FirebaseUser } from '../../../models/User';
import { auth, firestore } from '../../../libs/firebase';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

const UserProfile = ({user}: { user: FirebaseUser }) => {
   const [ isEditingUsername, setIsEditingUsername ] = useState(false);
   const uid = auth.currentUser?.uid;
   const userRef = firestore.collection('users').doc(uid);
   const [ userFetched ] = useDocumentDataOnce<FirebaseUser>(userRef);

   function handleEditUsername() {
      setIsEditingUsername(invertBool);
   }

   return (
       <Container className = 'box-center'>
          <img className = 'card-img-center' src = {user.photoURL} alt = {`Photo of ${user.displayName}`}/>
          <p>
             <i>
                {!isEditingUsername && <>@{user.username}</>}
                {userFetched?.username === user.username && <IconButton onClick = {handleEditUsername}>
                   <EditOutlined/>
                </IconButton>}
             </i>
          </p>
          {isEditingUsername && <UsernameForm mode = {UsernameFormModes.UPDATE} onSubmit = {handleEditUsername}/>}
          {user?.displayName && <h1>{user.displayName}</h1>}
       </Container>
   );
};

export default UserProfile;
