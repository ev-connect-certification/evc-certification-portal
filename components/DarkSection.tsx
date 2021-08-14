import {ReactNode} from 'react';

export default function DarkSection({children, className, light} : {children: ReactNode, className?: string, light?: boolean}) {
  return (
    <div className={`p-4 ${light ? "bg-white" : "bg-gray-3"} border border-gray-2 my-6 ` + (className || "")}>
        {children}
    </div>
  );
}