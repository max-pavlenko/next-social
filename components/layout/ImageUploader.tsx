import { useRef, useState } from 'react';
import Loader from './Loader';
import { IconButton, Typography } from '@mui/material';
import { auth, STATE_CHANGED, storage } from '../../libs/firebase';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toastNotify } from '../../utils/helpers';
import User from '../../store/User';
import { observer } from 'mobx-react-lite';

const ImageUploader = observer(({shouldShowText = true}: { shouldShowText?: boolean }) => {
   const uploading = useRef(false);
   const [ progress, setProgress ] = useState(0);
   const [ downloadURL, setDownloadURL ] = useState(null);

   function uploadFile(e) {
      const file = e.target.files[0];
      //console.log(file);
      const extension = file.type.split('/')[1];
      // make reference in firebase bucket
      const fileRef = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
      uploading.current = true;
      // start the upload
      const task = fileRef.put(file);
      // listen to upload progress
      task.on(STATE_CHANGED, snapshot => {
         const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
         setProgress(+progress);
         task.then(d => fileRef.getDownloadURL())
             .then(url => {
                setDownloadURL(url);
                uploading.current = false;
                console.log('...User.user.data', User.user.data);
                User.setPhotoURL(url)
             })
      })
   }

   async function handleCopyImg(url?: string) {
      await toastNotify({successText: 'copied image'}, {
         tryFn: () => {
            navigator.clipboard.writeText(url ? url : `![alt](${downloadURL})`)
         }
      })
   }

   return (
       <div className = 'box'>
          <Loader shouldShow = {uploading.current}/>
          {uploading.current && <Typography variant = 'h5'>{progress !== 100 ? `${progress} %` : ''}</Typography>}

          {!uploading.current && (
              <>
                 <label className = 'btn'>
                    Upload Image
                    <input type = 'file' onChange = {uploadFile} accept = 'image/png,image/gif,image/jpeg'/>
                 </label>
              </>
          )}
          {!shouldShowText &&
              <Typography textAlign = 'center'>Profile image preview</Typography>
          }
          {downloadURL && shouldShowText && (
              <>
                 <code style = {{whiteSpace: 'nowrap', alignSelf: 'center'}} className = 'upload-snippet'>
                    {`![alt](${downloadURL})`}
                 </code>
                 <IconButton disableRipple = {true} onClick = {() => handleCopyImg()} sx = {{alignSelf: 'center'}}>
                    <ContentCopyIcon/>
                 </IconButton>
              </>
          )}
       </div>
   );
});

export default ImageUploader;
