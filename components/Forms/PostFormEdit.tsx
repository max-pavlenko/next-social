import { IPost } from "../../models/Post";
import { DocumentReference, serverTimestamp } from "../../libs/firebase";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown/with-html";
import { Button, Checkbox, Container, FormControlLabel, FormGroup, TextField, Typography, } from "@mui/material";
import styles from "../../styles/Admin.module.scss";
import { CheckmarkIcon } from "react-hot-toast";
import { useState } from "react";
import { invertBool, toastNotify } from '../../utils/helpers';
import ImageUploader from '../layout/ImageUploader';

export interface EditForm {
   content: string,
   isPublished: string
}

function PostFormEdit({
                         isPreview,
                         defaultValue,
                         postRef,
                      }: { isPreview: boolean; defaultValue: IPost; postRef: DocumentReference; }) {

   const {register, handleSubmit, reset, watch, formState, errors, control} = useForm<EditForm>({
      mode: "onChange",
      defaultValues: defaultValue,
   });
   const [ isEditingTitle, setIsEditingTitle ] = useState(false);
   const [ title, setTitle ] = useState(defaultValue.title);
   const {isDirty, isValid} = formState;

   const onFormSubmit: SubmitHandler<EditForm> = async ({content, isPublished}) => {
      await toastNotify({successText: 'updated the post'}, {
         tryFn: async () => {
            await postRef.update({
               title,
               content,
               published: isPublished,
               updatedAt: serverTimestamp(),
            });
         }
      })
   }

   function handleContextTitle(e: any) {
      e.preventDefault();
      setIsEditingTitle(invertBool);
   }

   return (
       <form onSubmit = {handleSubmit(onFormSubmit)}>
          <Typography mb = '6px' component = 'div' variant = 'caption'>Right click to edit title</Typography>
          <h1 style = {{margin: 0}} onContextMenu = {handleContextTitle}>
             {!isEditingTitle ? (
                 <>{title}</>
             ) : (
                 <TextField
                     autoFocus
                     value = {title}
                     onChange = {(e) => setTitle(e.target.value)}
                     name = 'title'
                     onBlur = {() => {
                        !title && setTitle(defaultValue.title)
                        setTimeout(() => setIsEditingTitle(false), 0);
                     }}
                     placeholder = "My awesome post"
                     label = "Title"
                     fullWidth
                 />
             )}
          </h1>

          <ImageUploader/>

          <Container className = {isPreview ? styles.hidden : styles.controls}>
             <p>{defaultValue.slug}</p>
             <Controller name = "content"
                         control = {control}
                         rules = {{
                            minLength: {value: 10, message: 'Content length is too short'},
                            maxLength: {value: 10000, message: 'Content length is too long'},
                            required: {value: true, message: 'Content is required'},
                         }}
                         render = {(obj) =>
                             <TextField
                                 color = 'success'
                                 autoFocus
                                 {...obj}
                                 inputRef={obj.ref}
                                 error = {!!errors.content}
                                 placeholder = "Your content"
                                 helperText = {errors.content?.message || ''}
                                 multiline
                                 rows = {10}
                             />}/>

             <FormGroup>
                <FormControlLabel
                    sx = {{userSelect: 'none'}}
                    control = {
                       <Checkbox
                           checkedIcon = {<CheckmarkIcon/>}
                           id = "isPublished"
                           name = "isPublished"
                           inputRef = {register}
                           defaultChecked
                       />
                    }
                    label = "Mark as public?"
                />
             </FormGroup>

             <Button disabled = {!isValid} sx = {{alignSelf: 'center'}} type = "submit" variant = "contained">
                Save Changes
             </Button>
          </Container>

          {isPreview && (
              <div className = "card">
                 <ReactMarkdown>{watch("content")}</ReactMarkdown>
              </div>
          )}
       </form>
   );
}

export default PostFormEdit;
