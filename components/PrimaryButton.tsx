import Button, {ButtonProps} from "./Button";

export default function PrimaryButton(props: ButtonProps) {
    return (
        <Button {...props} className={props.className + " bg-ev-blue h-7 px-3 rounded flex items-center text-white"}>{props.children}</Button>
    )
}