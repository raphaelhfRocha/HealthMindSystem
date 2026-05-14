import { useState } from "react";

export function useModal() {
    const [open, setOpen] = useState(false);

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    return {
        open,
        openModal,
        closeModal
    };
}