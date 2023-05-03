import Head from 'next/head';
import { FC } from 'react';
import { Head } from 'next/document';

type Props = { title: string, desc: string, imagePath?: string }
const MetaTags: FC<Props> = ({ desc, imagePath = `${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/images/billy-sky.png`, title }) => {
   const img = imagePath;
   let computedTitle = title ? `${title} | NXT` : '- NXT -';
   if (title === 'undefined') computedTitle = 'NXT | Social & Experience';
   return (
     <>
        <Head>
           <title>{computedTitle}</title>
           <meta name="twitter:card" content="NXT | Social & Experience" />
           <meta name="twitter:site" content={process.env.NEXT_PUBLIC_SERVER_URL_PROD} />
           <meta name="twitter:title" content={title} />
           <meta name="twitter:description" content={desc} />
           <meta name="twitter:image" content={img} />

           <meta property="og:title" content={title} />
           <meta property="og:site_name" content="Next Social" />
           <meta property="og:description" content={desc} />
           <meta property="og:image" content={img} />
        </Head>
     </>
   );
};

export default MetaTags;
