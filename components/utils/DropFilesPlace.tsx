import React, { FunctionComponent } from 'react';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
const DropFilesPlace = ({}) => {

  return (
      <div style={{width: '100%', height: '100%', display: 'flex',justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
         <UploadFileOutlinedIcon />
         <p>You can drop selected files right here</p>
      </div>
  );
};

export default DropFilesPlace;
