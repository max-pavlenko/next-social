import { IPost } from "../../models/Post";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown/with-html";
import {
   Button,
   Checkbox,
   Container,
   FormControlLabel,
   FormGroup,
   IconButton,
   TextField,
   Typography,
} from "@mui/material";
import styles from "../../styles/Admin.module.scss";
import { useEffect, useRef, useState } from "react";
import { hanlePasteImage, invertBool, iterateOverFiles, toastNotify } from "../../utils/helpers";
import ImageUploader from "../layout/ImageUploader";
import { useLocale } from '../../translations/useLocale';
import useLessThenMediaQuery from '../../libs/hooks/useLessThenMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import UseDnD from '../../libs/hooks/useDnD';

export interface EditForm {
   content: string;
   isPublished: string;
}

export interface AdditionalImageData { img: string, id: number, file?: File }

function PostFormEdit({
                         isPreview,
                         defaultValue,
                         onSubmitEdit,
                      }: {
   isPreview: boolean;
   defaultValue: IPost;
   onSubmitEdit: (title: string, content: string, isPublished: string, additionalImages: AdditionalImageData[]) => void;
}) {
   const {register, handleSubmit, reset, watch, formState, errors, control} = useForm<EditForm>({
          mode: "onChange",
          defaultValues: defaultValue,
       });
   const [ additionalImages, setAdditionalImages ] = useState<AdditionalImageData[]>([]);
   const [ isEditingTitle, setIsEditingTitle ] = useState(false);
   const {isScreenWidthLessThen900} = useLessThenMediaQuery(900);
   const [ content, setContent ] = useState<string>(defaultValue.content);
   const [ title, setTitle ] = useState(defaultValue.title);
   const l = useLocale();
   const {isDirty, isValid} = formState;
   const textFieldRef = useRef<HTMLTextAreaElement>(null);
   const fileUploadInputRef = useRef<HTMLInputElement>(null);
   const {isDragEntered} = UseDnD(textFieldRef.current, 'draggedOver', setAdditionalImages);


   useEffect(() => {
      const pasteHandler = hanlePasteImage(setAdditionalImages)
      textFieldRef.current?.addEventListener('paste', pasteHandler)

      return () => {
         textFieldRef.current?.removeEventListener('paste', pasteHandler)
      }
   }, []);

   const onFormSubmit: SubmitHandler<EditForm> = async ({
                                                           content: contentFromForm,
                                                           isPublished,
                                                        }) => {
      await toastNotify(
          {successText: "saved the post"},
          {
             tryFn: () => onSubmitEdit(title, content, isPublished, additionalImages),
          }
      );
   };

   function handleContextTitle(e: any) {
      e.preventDefault();
      setIsEditingTitle(invertBool);
   }

   function handleFilesAttach() {
      fileUploadInputRef.current.click();
   }

   const handleFileInput = (event) => {
      event.preventDefault()
      const files = event.target.files; // files are empty in console - known bug
      console.log('event.target', files);
      iterateOverFiles(files, ({file, url}) => {
         setAdditionalImages((prev) => {
            if (prev.find((item) => item?.file?.name === file.name)) {
               return [ ...prev ];
            }
            return [ ...prev, {
               img: url,
               file: file,
               id: Date.now()
            } ]
         })
      })
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
   }

   function handleGoDownClick(e) {
      window.scroll(0, document.body.scrollHeight)
   }

   return (
       <>
          {additionalImages.length > 0 && <IconButton className = 'rainbow go-down-btn' onClick = {handleGoDownClick} color = 'primary' size = 'large'>
              <KeyboardDoubleArrowDownRoundedIcon/>
          </IconButton>}

          <form onSubmit = {handleSubmit(onFormSubmit)}>
             <Typography mb = "9px" component = "div" variant = "caption">
                {l.rightClickToEditTitle}
             </Typography>
             <h1 style = {{margin: 0}} onContextMenu = {handleContextTitle}>
                {!isEditingTitle ? (
                    <>{title}</>
                ) : (
                    <TextField
                        value = {title}
                        autoFocus
                        onChange = {(e) => setTitle(e.target.value)}
                        name = "title"
                        onBlur = {() => {
                           !title && setTitle(defaultValue.title);
                           setTimeout(() => setIsEditingTitle(false), 0);
                        }}
                        placeholder = "My awesome post"
                        label = "Title"
                        fullWidth
                    />
                )}
             </h1>

             <ImageUploader/>

             {!isPreview && (
                 <Container className = {styles.controls}>
                    <p
                        style = {{
                           display: "flex",
                           justifyContent: "space-between",
                           alignItems: "center",
                           flexWrap: 'wrap',
                        }}
                    >
                       <span>{defaultValue.slug}</span>

                       <label htmlFor = "file">
                          <Typography
                              sx = {{cursor: "pointer", mr: "5px"}}
                              variant = "caption"
                          >
                             Paste, DnD or choose photos
                          </Typography>
                          <IconButton size = "large" onClick = {handleFilesAttach}>
                             <AttachFileOutlinedIcon/>
                          </IconButton>
                       </label>
                       <input
                           onChange = {handleFileInput}
                           ref = {fileUploadInputRef}
                           id = "file"
                           style = {{display: "none"}}
                           type = "file"
                           multiple
                           accept = "image/*"
                       />
                    </p>
                    <Controller
                        name = "content"
                        control = {control}
                        rules = {{
                           minLength: {
                              value: 10,
                              message: "Content length is too short",
                           },
                           maxLength: {
                              value: 10000,
                              message: "Content length is too long",
                           },
                           required: {value: true, message: "Content is required"},
                        }}
                        render = {(obj) => (
                            <TextField
                                color = "success"
                                autoFocus = {!isScreenWidthLessThen900}
                                {...obj}
                                fullWidth
                                inputRef = {obj.ref}
                                inputProps = {{
                                   ref: (input) => {
                                      textFieldRef.current = input;
                                   },
                                }}
                                error = {!!errors.content}
                                onChange = {(e) => {
                                   setContent(e.target.value);
                                }}
                                value = {content}
                                placeholder = "Your content"
                                helperText = {errors.content?.message || ""}
                                multiline
                                rows = {12}
                            />
                        )}
                    />

                    <FormGroup>
                       <FormControlLabel
                           sx = {{userSelect: "none"}}
                           control = {
                              <Checkbox
                                  // checkedIcon = {<CheckmarkIcon/>}
                                  id = "isPublished"
                                  name = "isPublished"
                                  inputRef = {register}
                                  defaultChecked
                              />
                           }
                           label = {`${l.markAsPublic}?`}
                       />
                    </FormGroup>
                 </Container>
             )}

             {isPreview && (
                 <div className = "card">
                    <ReactMarkdown>{content}</ReactMarkdown> {/* watch("content") */}
                 </div>
             )}
             <Button
                 disabled = {!isValid}
                 sx = {{display: "flex", margin: "5px auto"}}
                 type = "submit"
                 variant = "contained"
             >
                {l.saveChanges}
             </Button>
             {additionalImages.length > 0 && (
                 <div className='spacer'>
                    <ul className = "additionalImagesList">
                       {additionalImages.map(({img, id}) => {
                          return (
                              <div key = {id}>
                                 <li
                                     style = {{
                                        width: "200px",
                                        position: "relative",
                                        height: "100%",
                                     }}
                                     key = {id}
                                 >
                                    <IconButton
                                        size = "small"
                                        color = "warning"
                                        style = {{
                                           position: "absolute",
                                           top: "5px",
                                           right: "5px",
                                           mixBlendMode: "difference",
                                           backdropFilter: "blur(1.2px)",
                                        }}
                                        onClick = {() =>
                                            setAdditionalImages((prevState) =>
                                                prevState.filter((image) => image.id !== id)
                                            )
                                        }
                                    >
                                       <CloseIcon/>
                                    </IconButton>

                                    <img
                                        style = {{
                                           objectFit: "cover",
                                           maxWidth: "initial",
                                           pointerEvents: "none",
                                           width: "100%",
                                           height: "100%",
                                        }}
                                        src = {img}
                                        alt = "additional image"
                                    />
                                 </li>
                              </div>
                          );
                       })}
                    </ul>
                    <h3 style={{textAlign: 'center', marginTop: '5px'}}>Additional images</h3>
                 </div>
             )}
          </form>
       </>
   );
}

export default PostFormEdit;
