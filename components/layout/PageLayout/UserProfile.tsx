import { Container, IconButton } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import UsernameForm from '../../Forms/UsernameForm';
import { invertBool } from '../../../utils/helpers';
import { UsernameFormModes } from '../../../models/Form';
import { FirebaseUser } from '../../../models/User';

const UserProfile = ({user}: { user: FirebaseUser }) => {
   const [ isEditingUsername, setIsEditingUsername ] = useState(false);

   function handleEditUsername() {
      setIsEditingUsername(invertBool);
   }

   return (
       <Container className = 'box-center'>
          <img className = 'card-img-center' src = {user.photoURL} alt = {`Photo of ${user.displayName}`}/>
          <p>
             <i>
                {!isEditingUsername && <>@{user.username}</>
                }
                <IconButton onClick = {handleEditUsername}>
                   <EditOutlined/>
                </IconButton>
             </i>
          </p>
          {isEditingUsername && <UsernameForm mode = {UsernameFormModes.UPDATE} onSubmit = {handleEditUsername}/>}
          <h1>
             {user.displayName || ''}
          </h1>
       </Container>
   );
};

export default UserProfile;
