import {ReactNode} from 'react';

export default function ThreeCol({children, className} : {children: ReactNode, className?: string}) {
  return (
    <div className={"grid grid-cols-3 gap-x-4 gap-y-2 grid-flow-col " + (className || "")} style={{gridTemplateRows: "repeat(2, max-content)"}}>
        {children}
    </div>
  );
}