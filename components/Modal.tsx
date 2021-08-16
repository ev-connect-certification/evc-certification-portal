import {Dispatch, ReactNode, SetStateAction} from 'react';
import ReactModal from "react-modal";

export default function Modal({isOpen, setIsOpen, children}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
}) {
    const modalClasses = "top-24 left-1/2 fixed bg-white p-4 rounded-md shadow mx-4";

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={modalClasses}
            style={{content: {transform: "translateX(calc(-50% - 16px))", maxWidth: "350px", width: 700}, overlay: {zIndex: 50, backgroundColor: "rgb(84, 105, 131, 0.7)"}}}
        >
            {children}
        </ReactModal>
    );
}