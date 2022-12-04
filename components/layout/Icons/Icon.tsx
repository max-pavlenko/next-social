import React from 'react';
import Woman from '../../../public/icons/retro-woman-closeup.svg'

const Icon = ({icon}) => {
    switch (icon) {
        case 'woman':
            return <img src={Woman} alt={'123'}/>;
        default: return <div>No icon found!</div>
    }
};

export default Icon;

/*const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching
});*/