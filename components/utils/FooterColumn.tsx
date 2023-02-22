import React, {ReactNode} from 'react';

const FooterColumn = ({children, title = ''}: {children: ReactNode, title: string}) => {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 20 }}>
          {title && <h3 style={{ userSelect: "none" }}>{title}</h3>}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 15
          }}>
            {children}
          </div>
        </div>
        <div className="vertical-delimeter" />
      </>
);
};

export default FooterColumn;