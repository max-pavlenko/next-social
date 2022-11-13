import { useRef, useState } from 'react';
import Loader from './Loader';
import { IconButton, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toastNotify } from '../../utils/helpers';
import { observer } from 'mobx-react-lite';
import { useLocale } from '../../translations/useLocale';
import { useUploadFileToFB } from '../../utils/useUploadFileToFB';

export interface FileData {uploading: boolean, downloadURL: null | string, progress: number}

const ImageUploader = observer(({shouldShowImgURL = true}: { shouldShowImgURL?: boolean }) => {
   const l = useLocale();
   const [ file, setFile ] = useState<File>(null);
   const fileData = useRef<FileData>({uploading: false, downloadURL: null, progress: 0});
   fileData.current = useUploadFileToFB(file);

   async function handleCopyImgURL(url?: string) {
      await toastNotify({successText: 'copied image'}, {
         tryFn: () => {
            navigator.clipboard.writeText(url ? url : `![alt](${downloadURL})`)
         }
      })
   }

   async function handleImageUploadChange(e) {
      console.log('ee', e.target.files[0]);
      setFile(e.target.files[0])
   }
   const {uploading, downloadURL, progress} = fileData.current;

   return (
       <div className = 'box'>
          <Loader shouldShow = {uploading}/>
          {uploading && <Typography variant = 'h5'>{progress !== 100 ? `${progress} %` : ''}</Typography>}

          {!uploading && (
              <>
                 <label className = 'btn'>
                    {l.uploadImage}
                    <input type = 'file' onChange = {handleImageUploadChange} accept = 'image/png, image/gif, image/jpeg, image/*'/>
                 </label>
              </>
          )}
          {!shouldShowImgURL &&
              <Typography textAlign = 'center'>Profile image preview</Typography>
          }
          {downloadURL && shouldShowImgURL && (
              <>
                 <code style = {{whiteSpace: 'nowrap', alignSelf: 'center'}} className = 'upload-snippet'>
                    {`![alt](${downloadURL})`}
                 </code>
                 <IconButton disableRipple = {true} onClick = {() => handleCopyImgURL()} sx = {{alignSelf: 'center'}}>
                    <ContentCopyIcon/>
                 </IconButton>
              </>
          )}
       </div>
   );
});

export default ImageUploader;
