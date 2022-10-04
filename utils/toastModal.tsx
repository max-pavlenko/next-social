import toast, { ToastOptions } from "react-hot-toast";
import { Button, Container } from "@mui/material";
import { toastStyleConfig } from "./constants";
import { ReactNode } from 'react';

export const toastModal = (
    text: string = 'default',
    onYesClicked,
    onNoClicked = () => null,
    configOptions: ToastOptions = {}
) => {
   toast(
       (t) => (
           <>
              <span style = {{textAlign: "center"}}>{text}
                 <ModalButtons toast = {t} onYesClicked = {onYesClicked} onNoClicked = {onNoClicked}/>
              </span>
           </>
       ),
       {...Object.assign(toastStyleConfig, configOptions)}
   );
};

export function ModalButtons({onYesClicked, onNoClicked, toast: t}) {
   return (
       <Container
           sx = {{
              display: "flex",
              justifyContent: "center",
              gap: "7px",
              my: "8px",
           }}
       >
          <Button
              variant = "contained"
              color = "error"
              onClick = {async () => {
                 toast.dismiss(t.id);
                 await onYesClicked();
              }}
          >
             Yes
          </Button>
          <Button
              variant = "outlined"
              color = "primary"
              onClick = {async () => {
                 toast.dismiss(t.id);
                 await onNoClicked();
              }}
          >
             Dismiss
          </Button>
       </Container>
   );
}
