import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import Link, { LinkProps } from 'next/link';

type Props = LinkProps & { style?: CSSProperties, className?: string }
const LinkWithoutScroll: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
   return (
     <Link {...props} scroll={false}>
        {children}
     </Link>
   );
};

export default LinkWithoutScroll;
