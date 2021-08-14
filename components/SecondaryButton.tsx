import Button, {ButtonProps} from "./Button";

export default function SecondaryButton(props: ButtonProps) {
    return (
        <Button {...props} className={props.className + " text-ev-blue border-2 border-ev-blue h-7 px-3 rounded flex items-center"}>{props.children}</Button>
    )
}