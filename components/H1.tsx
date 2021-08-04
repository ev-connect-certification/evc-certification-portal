import {ReactNode} from 'react';

export default function H1({children, className} : {children: ReactNode, className?: string}) {
  return (
    <h1 className={"text-xl font-bold " + (className || "")}>
        {children}
    </h1>
  );
}