import {ReactNode} from 'react';

export default function H2({children, className} : {children: ReactNode, className?: string}) {
  return (
    <h2 className={"text-lg font-bold text-gray-1 " + (className || "")}>
        {children}
    </h2>
  );
}