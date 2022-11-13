import React, { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';

interface IProps extends LinkProps {
   children: ReactNode,
   style?: React.CSSProperties,
   className?: string,
}

const LinkWithoutScroll = ({ href, children, style = {}, className = '', ...rest }: IProps) => {
   return (
       <Link {...rest} className={className} style={style} scroll={false} href={href}>
          {children}
       </Link>
   );
};

export default LinkWithoutScroll;
