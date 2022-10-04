import Head from 'next/head';

const MetaTags = ({desc, imagePath, title}: {title: string, desc: string, imagePath: string}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name = 'twitter:card' content = 'summary'/>
                <meta name = 'twitter:site' content = 'localhost:3000'/>
                <meta name = 'twitter:title' content = {title}/>
                <meta name = 'twitter:description' content = {desc}/>
                <meta name = 'twitter:image' content = {imagePath}/>

                <meta property = 'og:title' content = {title}/>
                <meta property = "og:site_name" content = "Nxt Social"/>
                <meta property = 'og:description' content = {desc}/>
                <meta property = 'og:image' content = {imagePath}/>
            </Head>
        </>
    );
};

export default MetaTags;
