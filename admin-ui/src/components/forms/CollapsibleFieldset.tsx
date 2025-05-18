import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function CollapsibleFieldset({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <fieldset className="border rounded">
            <legend
                className="font-medium px-3 py-2 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <span>{title}</span>
                {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </legend>
            {open && <div className="px-3 pb-3">{children}</div>}
        </fieldset>
    );
}
