import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
   return (
       <Html>
          <Head>
             <link rel = "manifest" href = "/manifest.json"/>

             <meta name = "mobile-web-app-capable" content = "yes"/>
             <meta name = "apple-mobile-web-app-capable" content = "yes"/>
             <meta name = "application-name" content = "NXT"/>
             <meta name = "apple-mobile-web-app-title" content = "NXT | Social"/>
             <meta name = "theme-color" content = "violet"/>
             <meta name = "msapplication-navbutton-color" content = "lime"/>
             <meta name = "apple-mobile-web-app-status-bar-style" content = "orange-translucent"/>
             <meta name = "msapplication-starturl" content = "/"/>

             <link rel = "icon" type = "image/png" sizes = "72x72" href = "/icons/icon-72x72.png"/>
             <link rel = "icon" type = "image/png" sizes = "96x96" href = "/icons/icon-96x96.png"/>
             <link rel = "icon" type = "image/png" sizes = "128x128" href = "/icons/icon-128x128.png"/>
             <link rel = "icon" type = "image/png" sizes = "144x144" href = "/icons/icon-144x144.png"/>
             <link rel = "icon" type = "image/png" sizes = "152x152" href = "/icons/icon-152x152.png"/>
             <link rel = "icon" type = "image/png" sizes = "192x192" href = "/icons/icon-192x192.png"/>
             <link rel = "icon" type = "image/png" sizes = "384x384" href = "/icons/icon-384x384.png"/>
             <link rel = "icon" type = "image/png" sizes = "512x512" href = "/icons/icon-512x512.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "72x72" href = "/icons/icon-72x72.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "96x96" href = "/icons/icon-96x96.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "128x128" href = "/icons/icon-128x128.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "144x144" href = "/icons/icon-144x144.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "152x152" href = "/icons/icon-152x152.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "192x192" href = "/icons/icon-192x192.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "384x384" href = "/icons/icon-384x384.png"/>
             <link rel = "apple-touch-icon" type = "image/png" sizes = "512x512" href = "/icons/icon-512x512.png"/>
             <title>NXT | Social</title>
          </Head>
          <body>
          <Main/>
          <NextScript/>
          </body>
       </Html>
   )
}
