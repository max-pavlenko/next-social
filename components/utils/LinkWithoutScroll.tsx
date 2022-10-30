import React, { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';

interface IProps extends LinkProps {
   children: ReactNode
}

const LinkWithoutScroll = ({ href, children, ...rest }: IProps) => {
   return (
       <Link {...rest} scroll={false} href={href}>
          {children}
       </Link>
   );
};

export default LinkWithoutScroll;
