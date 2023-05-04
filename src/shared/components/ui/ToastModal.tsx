import toast, { Toast, ToastOptions } from 'react-hot-toast';
import { Button, Container } from '@mui/material';
import { toastStyleConfig } from '../../../../utils/constants';
import { FC } from 'react';

type YesOrNoHandler = {
   onYesClicked: () => void,
   onNoClicked?: () => void,
}
type ToastParams = {
   text?: string,
   configOptions?: ToastOptions,
} & YesOrNoHandler
export const toastModal = (
  {
     text = 'default',
     onYesClicked,
     onNoClicked = () => null,
     configOptions = {},
  }: ToastParams) => {
   toast(
     (t) => (
       <>
              <span style={{ textAlign: 'center' }}>{text}
                 <ModalButtons toast={t} onYesClicked={onYesClicked} onNoClicked={onNoClicked} />
              </span>
       </>
     ),
     { ...Object.assign(toastStyleConfig, configOptions) },
   );
};

export const ModalButtons: FC<YesOrNoHandler & { toast: Toast }> = ({
   onYesClicked, onNoClicked = () => {
   }, toast: t,
}) => {
   return (
     <Container
       sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '7px',
          my: '8px',
       }}
     >
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
             toast.dismiss(t.id);
             await onYesClicked();
          }}
        >
           Yes
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
             toast.dismiss(t.id);
             await onNoClicked();
          }}
        >
           Dismiss
        </Button>
     </Container>
   );
};
