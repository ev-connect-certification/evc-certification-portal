import Button, {ButtonProps} from "./Button";

export default function Tab(props: ButtonProps & {selected: boolean}) {
    return (
        <Button {...props} className={props.className + " h-full px-4 flex items-center text-sm" + (props.selected ? " border-b-2 border-t-2 border-b-ev-blue border-t-transparent" : " text-gray-1")}>{props.children}</Button>
    )
}