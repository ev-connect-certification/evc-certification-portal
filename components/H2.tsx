import {ReactNode} from 'react';

export default function H2(props: React.HTMLProps<HTMLHeadingElement>) {
  let newProps = {...props};
  delete newProps.className;

  return (
    <h2 className={"text-lg font-bold text-gray-1 " + (props.className || "")} {...newProps}>
        {props.children}
    </h2>
  );
}