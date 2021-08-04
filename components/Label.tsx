import {ReactNode} from 'react';

export default function Label({children, className} : {children: ReactNode, className?: string}) {
  return (
    <div className={"font-bold text-gray-1 " + (className || "")}>
        {children}
    </div>
  );
}