import { useEffect, useState } from 'react';
import { iterateOverFiles } from '../../utils/helpers';

export default function(element: HTMLElement, classesForDragIn: string, cb = ({ img, id }: { img: string, id: number }) => {
}) {
   const [isDragEntered, setIsDragEntered] = useState(false);
   const [fileList, setFileList] = useState<{ file: File, data: string }[]>([]);

   useEffect(() => {
      if (!element) return;
      element.addEventListener('dragenter', handleDragEnter);
      element.addEventListener('dragleave', handleDragLeave);
      element.addEventListener('drop', handleDragDrop);

      return () => {
         element.removeEventListener('dragenter', handleDragEnter);
         element.removeEventListener('dragleave', handleDragLeave);
         element.removeEventListener('drop', handleDragDrop);
      };
   }, [element]);

   useEffect(() => {
      element?.classList.toggle(classesForDragIn);
   }, [isDragEntered]);

   function handleDragEnter(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      console.log('entered drop');
      setIsDragEntered(true);
   }

   function handleDragLeave(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragEntered(false);
   }

   function handleDragDrop(e: DragEvent) {
      e.preventDefault();
      const files = e.dataTransfer?.files || [] as unknown as FileList;
      console.log('e', files);
      iterateOverFiles(files, ({ file, url }) => {

         cb({
            img: url,
            // file: file,
            id: Math.round(Date.now() * Math.random()),
         });


         setFileList((prev) => {
            if (prev.find((item) => item.file.name === file.name)) {
               return [...prev];
            }

            return [...prev, {
               data: url,
               file,
            }];
         });
      });

      // if (e.dataTransfer.files.length > 0) {
      //    const keys = Object.keys(files);
      //    keys.forEach((key) => {
      //       let reader = new FileReader();
      //       let file = files[key];
      //       reader.onload = (e) => {
      //          additionalSetter(prev => [...prev, {
      //             img: e.target.result as string,
      //             file: file,
      //             id: Math.random(),
      //          }])
      //
      //          setFileList((prev) => {
      //             if (prev.find((item) => item.file.name === file.name)) {
      //                return [...prev];
      //             }
      //
      //             return [...prev, {
      //                data: e.target.result as string,
      //                file: file,
      //             }]
      //          })
      //       }
      //       reader.readAsDataURL(file)
      //    })
      // }

      setIsDragEntered(false);
   }

   return { fileList, isDragEntered };
}
