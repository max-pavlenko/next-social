import { toastNotify } from "./helpers";
import { auth, STATE_CHANGED, storage } from "../libs/firebase";
import User from "../store/User";
import { useEffect, useRef, useState } from "react";
import { FileData } from '../components/layout/ImageUploader';

const POSSIBLE_IMAGE_EXTENSION = [ "png", "jpeg", "jpg", "gif" ];

export function useUploadFileToFB(
    file: File,
    possibleExtensions: string[] = POSSIBLE_IMAGE_EXTENSION
): FileData {
   const [ progress, setProgress ] = useState(0);
   const [ downloadURL, setDownloadURL ] = useState(null);
   const uploading = useRef(false);
   let result = {progress, downloadURL, uploading: uploading.current}

   useEffect(() => {
      if(!file) return;

      const extension = file.type.split("/")[1];
      if (!possibleExtensions.includes(extension)){
         toastNotify(
             {errorText: "File isn\'t an image!", successText: "none"},
             {
                tryFn: () => {
                   return new Promise((resolve, reject) => reject());
                },
             }
         ).then();
         return;
      }

      // make reference in firebase bucket
      const fileRef = storage.ref(
          `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
      );
      uploading.current = true;
      // start the upload
      const task = fileRef.put(file);
      task.on(STATE_CHANGED, (snapshot) => {
         const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
         setProgress(+progress);
         task
             .then((d) => fileRef.getDownloadURL())
             .then((url) => {
                setDownloadURL(url);
                uploading.current = false;
                console.log("...User.user.data", User.user.data);
                User.setPhotoURL(url);
             });
      });
      result = {progress, downloadURL, uploading: uploading.current};

   }, [ file ]);

   return result;
}
