import Head from 'next/head';

const MetaTags = ({desc, imagePath, title}: {title: string, desc: string, imagePath: string}) => {
    const img = imagePath;
    const computedTitle = title || ' ';
    return (
        <>
            <Head>
                <title>{computedTitle} | NXT</title>
                <meta name = 'twitter:card' content = 'summary'/>
                <meta name = 'twitter:site' content = {process.env.NEXT_PUBLIC_SERVER_URL_PROD}/>
                <meta name = 'twitter:title' content = {title}/>
                <meta name = 'twitter:description' content = {desc}/>
                <meta name = 'twitter:image' content = {img}/>

                <meta property = 'og:title' content = {title}/>
                <meta property = "og:site_name" content = "Nxt Social"/>
                <meta property = 'og:description' content = {desc}/>
                <meta property = 'og:image' content = {img}/>
            </Head>
        </>
    );
};

export default MetaTags;
