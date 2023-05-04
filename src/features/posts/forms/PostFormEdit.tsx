import { IPost } from '../../../../models/Post';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown/with-html';
import { Button, Checkbox, Container, FormControlLabel, FormGroup, IconButton, TextField, Typography } from '@mui/material';
import styles from '../../../../styles/Admin.module.scss';
import { ChangeEvent, FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { handlePasteImage, invertBoolState, iterateOverFiles, toastNotify } from '../../../../utils/helpers';
import ImageUploader from '../../../shared/components/widgets/ImageUploader';
import { useLocale } from '../../../../translations/useLocale';
import useLessThenMediaQuery from '../../../../libs/hooks/useLessThenMediaQuery';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import UseDnD from '../../../../libs/hooks/useDnD';
import ImageSliderList from '../../list/components/ImageSliderList';
import { useIntersection } from '../../../../libs/hooks/useIntersection';

export interface EditForm {
   content: string;
   isPublished: string;
}

export interface AdditionalImageData {
   img: string;
   id: number;
   file?: File;
}

type Props = {
   isPreview: boolean;
   onSubmit?: () => void,
   defaultValuePost: IPost;
   onSubmitEdit: (
     title: string,
     content: string,
     isPublished: string,
     additionalImages: AdditionalImageData[],
   ) => void;
}

const PostFormEdit: FC<Props> = ({
   isPreview, defaultValuePost, onSubmitEdit, onSubmit = () => {
   },
}) => {
   const { register, handleSubmit, reset, watch, formState, errors, control } =
     useForm<EditForm>({
        mode: 'onChange',
        defaultValues: defaultValuePost,
     });
   const { isScreenWidthLessThen1000 } = useLessThenMediaQuery(1000);
   const [additionalImages, setAdditionalImages] = useState<AdditionalImageData[]>(defaultValuePost.additionalImages || []);
   const [isEditingTitle, setIsEditingTitle] = useState(false);
   const { isScreenWidthLessThen900 } = useLessThenMediaQuery(900);
   const [content, setContent] = useState(defaultValuePost.content);
   const [title, setTitle] = useState(defaultValuePost.title);
   const l = useLocale();
   const { isDirty, isValid } = formState;
   const textFieldRef = useRef<HTMLTextAreaElement>(null);
   const fileUploadInputRef = useRef<HTMLInputElement>(null);
   const { isDragEntered } = UseDnD(
     textFieldRef.current!,
     'draggedOver',
     (additionalImage) => setAdditionalImages(prev => [...prev, additionalImage]),
   );
   const intersectBtnDownRef = useRef<HTMLDivElement>(null);
   const [isBtnDownVisible, setIsBtnDownVisible] = useState(true);

   useIntersection(
     intersectBtnDownRef.current,
     false,
     () => {
        setIsBtnDownVisible(true);
     },
     () => {
        setIsBtnDownVisible(false);
        console.log('intersect ', isBtnDownVisible);
     },
     10,
   );

   useEffect(() => {
      const pasteHandler = handlePasteImage((additionalImage) => setAdditionalImages(prevState => [...prevState, additionalImage]));
      textFieldRef.current?.addEventListener('paste', pasteHandler);

      return () => {
         textFieldRef.current?.removeEventListener('paste', pasteHandler);
      };
   }, []);

   const onFormSubmit: SubmitHandler<EditForm> = async ({ content: contentFromForm, isPublished }) => {
      onSubmit();
      await toastNotify(
        { successText: 'saved the post' },
        {
           tryFn: () =>
             onSubmitEdit(title, content, isPublished, additionalImages),
        },
      );
   };

   const handleContextTitle: MouseEventHandler<HTMLHeadingElement> = (e) => {
      e.preventDefault();
      setIsEditingTitle(invertBoolState);
   };

   function handleFilesAttach() {
      fileUploadInputRef.current!.click();
   }

   const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const files = event.target.files!; // files are empty in console - known bug
      console.log('event.target', files);
      iterateOverFiles(files, ({ file, url }) => {
         setAdditionalImages((prev) => {
            if (prev.find((item) => item?.file?.name === file.name)) {
               return [...prev];
            }
            return [
               ...prev,
               {
                  img: url,
                  file,
                  id: Date.now(),
               },
            ];
         });
      });
      // if (event.target.files && event.target.files[0]) {
      //    const keys = Object.keys(event.target.files)
      //    keys.forEach((key) => {
      //       let file = event.target.files[key]
      //       let reader = new FileReader();
      //       reader.onload = (e) => {
      //          setAdditionalImages((prev) => {
      //             if (prev.find((item) => item?.file?.name === file.name)) {
      //                return [ ...prev ];
      //             }
      //             return [ ...prev, {
      //                img: e.target.result as string,
      //                file: file,
      //                id: Date.now()
      //             } ]
      //          })
      //       }
      //       reader.readAsDataURL(event.target.files[key])
      //    })
      // }
   };

   const handleGoDownClick: MouseEventHandler = (e) => {
      window.scroll(0, document.body.scrollHeight);
   };

   return (
     <>
        {additionalImages.length > 0 && (
          <IconButton
            style={{
               visibility: isBtnDownVisible ? 'visible' : 'hidden',
               opacity: isBtnDownVisible ? 1 : 0,
               transition: '300ms all ease-in-out',
            }}
            className="rainbow go-down-btn"
            onClick={handleGoDownClick}
            color="primary"
            size="large"
          >
             <KeyboardDoubleArrowDownRoundedIcon />
          </IconButton>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)}>
           <Typography mb="9px" component="div" variant="caption">
              {isScreenWidthLessThen1000
                ? 'Double tap to edit the title'
                : l.rightClickToEditTitle}
           </Typography>
           <h1
             style={{ margin: 0, userSelect: 'none' }}
             onContextMenu={handleContextTitle}
           >
              {isEditingTitle ? (
                <TextField
                  value={title}
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                  onBlur={() => {
                     !title && setTitle(defaultValuePost.title);
                     setTimeout(() => setIsEditingTitle(false), 0);
                  }}
                  placeholder="My awesome post"
                  label="Title"
                  fullWidth
                />
              ) : (
                <>{title}</>
              )}
           </h1>

           <ImageUploader />

           {!isPreview && (
             <Container className={styles.controls}>
                <p
                  style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     flexWrap: 'wrap',
                  }}
                >
                   <span>{defaultValuePost.slug}</span>

                   <label style={{ whiteSpace: 'nowrap' }} htmlFor="file">
                      <Typography
                        sx={{ cursor: 'pointer', mr: '5px' }}
                        variant="caption"
                      >
                         Paste, DnD or choose additional photos
                      </Typography>
                      <IconButton size="large" onClick={handleFilesAttach}>
                         <AttachFileOutlinedIcon />
                      </IconButton>
                   </label>
                   <input
                     onChange={handleFileInput}
                     ref={fileUploadInputRef}
                     id="file"
                     style={{ display: 'none' }}
                     type="file"
                     multiple
                     accept="image/png, image/jpeg, image/webp"
                   />
                </p>
                <Controller
                  name="content"
                  control={control}
                  rules={{
                     minLength: {
                        value: 10,
                        message: 'Content length is too short',
                     },
                     maxLength: {
                        value: 10000,
                        message: 'Content length is too long',
                     },
                     required: { value: true, message: 'Content is required' },
                  }}
                  render={(obj) => (
                    <TextField
                      color="success"
                      autoFocus={!isScreenWidthLessThen900}
                      {...obj}
                      fullWidth
                      inputRef={obj.ref}
                      inputProps={{
                         ref: (input: HTMLTextAreaElement) => {
                            // @ts-ignore
                            textFieldRef.current = input;
                         },
                      }}
                      error={!!errors.content}
                      onChange={(e) => {
                         setContent(e.target.value);
                      }}
                      value={content}
                      placeholder="Your content"
                      helperText={errors.content?.message || ''}
                      multiline
                      rows={12}
                    />
                  )}
                />

                <FormGroup>
                   <FormControlLabel
                     sx={{ userSelect: 'none' }}
                     control={
                        <Checkbox
                          // checkedIcon = {<CheckmarkIcon/>}
                          id="isPublished"
                          name="isPublished"
                          inputRef={register}
                          defaultChecked
                        />
                     }
                     label={`${l.markAsPublic}?`}
                   />
                </FormGroup>
             </Container>
           )}

           {isPreview && (
             <div className="card">
                <ReactMarkdown>{content}</ReactMarkdown> {/* watch("content") */}
             </div>
           )}
           <Button
             disabled={!isValid}
             sx={{ display: 'flex', margin: '5px auto' }}
             type="submit"
             variant="contained"
           >
              {l.saveChanges}
           </Button>
           {additionalImages.length > 0 && (
             <ImageSliderList
               images={additionalImages}
               onCloseImgClick={(e, id) =>
                 setAdditionalImages((prevState) =>
                   prevState.filter((image) => image.id !== id),
                 )
               }
             />
           )}
           <div
             ref={intersectBtnDownRef}
             style={{ height: 1, backgroundColor: additionalImages.length ? 'gray' : 'initial' }}
           />
        </form>
     </>
   );
};

export default PostFormEdit;
