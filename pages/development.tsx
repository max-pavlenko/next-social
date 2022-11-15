import React, { MouseEvent } from 'react';
import { EMAIL, FEATURES_TO_DO, FEEDBACK_MEANS, TELEGRAM_NAME } from '../utils/constants';
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import CopyButton from '../components/utils/CopyButton';

export const onEmailClick = (event: MouseEvent<HTMLAnchorElement>) => {
   window.open(`mailto:${EMAIL}?subject=My idea&body=I think it's worth adding ...`, '_blank');
}

export function onTelegramClick(event: MouseEvent<HTMLAnchorElement>) {
   window.open(`https://t.me/${TELEGRAM_NAME}`, '_blank');
}

const DevelopmentPage = () => {
   const {push} = useRouter();

   async function handleDonateClick() {
      await push('/donate')
   }

   return (
       <Container style = {{height: 'calc(100vh - 120px)'}}>
          <h1>
             There are some features to be done sooner or later:
          </h1>
          <Typography variant = 'caption'>Yep, you can boost it by&nbsp;
             <a onClick = {handleDonateClick} style = {{color: 'var(--color-green)', fontWeight: 600}}>donation</a> ;)
          </Typography>

          <ul style = {{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px'}}>
             {FEATURES_TO_DO.map(({name, desc}) => (
                 <li key = {name}>
                    <h3>{name}</h3>
                    <p style = {{marginTop: '9px'}}>{desc}</p>
                 </li>
             ))}
          </ul>

          <div style = {{marginTop: 'auto'}}>
             <h3 style = {{textAlign: 'center'}}>Of course, you can report any bug or suggest an idea right there:</h3>
             <ul style = {{display: 'flex', padding: '0', flexDirection: 'column',listStyle: 'none', alignItems: 'center',}}>
                {FEEDBACK_MEANS.map(({type, content, color, clickHandler}) => (
                    <li key={type}>
                       <a onClick = {clickHandler} style = {{
                          color: `var(--color-${color})`, userSelect: 'none', borderBottom: '2px dashed' +
                              ` var(--color-${color})`
                       }}>{type} - {content}</a>
                       <CopyButton content={content}/>
                    </li>
                ))}
             </ul>
          </div>

       </Container>

   );
};

export default DevelopmentPage;
