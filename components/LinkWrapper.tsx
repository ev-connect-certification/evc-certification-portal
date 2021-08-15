import Link from "next/link";

export default function LinkWrapper(props: React.HTMLProps<HTMLAnchorElement>) {
    return (
        <Link href={props.href}>
            <a {...props}>
                {props.children}
            </a>
        </Link>
    );
}