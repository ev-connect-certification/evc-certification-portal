import {ReactNode} from 'react';
import Link from "next/link";

export default function HomeLinkWrapper({children, className} : {children: ReactNode, className?: string}) {
  return (
      <Link href="/">
          <a className={className || ""}>
              {children}
          </a>
      </Link>
  );
}