import React, { FC, useState } from 'react';

type Props = { switcherTop: number, content: Array<() => JSX.Element> }
const SmallTabs: FC<Props> = ({ content, switcherTop }) => {
   const [currentTab, setCurrentTab] = useState(0);

   function handleChangeTab(i: number) {
      setCurrentTab(i);
   }

   return (
     <div>
        <div>
           {content.map((item, i) => (
             <div style={{
                visibility: i === currentTab ? 'initial' : 'hidden',
                top: '-200%',
                position: `${i === currentTab ? 'static' : 'absolute'}`,
                opacity: i === currentTab ? 'initial' : 0,
             }} key={i}>{content[i]()}</div>
           ))}
        </div>
        <div style={{
           display: 'flex', gap: 3, position: 'fixed',
           left: '50%',
           padding: '5px 8px',
           backgroundColor: 'var(--color-bg)',
           borderRadius: '100px',
           bottom: `${switcherTop ?? 50}px`,
           transform: 'translateX(-50%)', justifyContent: 'center', marginTop: 8,
        }}>
           {content.map((_, i) => (
             <a onClick={() => handleChangeTab(i)} className={`slideDot ${i === currentTab && 'activeDot'}`} key={i} />
           ))}
        </div>
     </div>
   );
};

export default SmallTabs;
