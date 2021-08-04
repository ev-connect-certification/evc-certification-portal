import {ReactNode} from 'react';

export default function DarkSection({children, className} : {children: ReactNode, className?: string}) {
  return (
    <div className={"p-4 bg-gray-3 border border-gray-2 my-6 " + (className || "")}>
        {children}
    </div>
  );
}