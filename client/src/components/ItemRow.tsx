import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { useState } from "react";
import type { Item, FormDataType } from "@/types/formDataType";
import { CgRadioChecked } from "react-icons/cg";
import { CgRadioCheck } from "react-icons/cg";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { Separator } from "./ui/separator";
import Form from "./shared/Form";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface Props {
    item: Item;
    id: number;
    isDone: boolean;
    onDeleteItem: (id: number) => void;
    onToggleItemDone: (id: number) => void;
    onSaveEditedItem?: (id: number, data: Item) => void;
}

const ItemList = ({
    item,
    id,
    isDone,
    onDeleteItem,
    onToggleItemDone,
    onSaveEditedItem,
}: Props) => {
    const [open, setOpen] = useState(false);

    const saveItem = (data: Item | FormDataType) => {
        onSaveEditedItem && onSaveEditedItem(id, {
            ...item,
            title: data.title,
            description: data.description,
            date: data.date,
        });
        setOpen(false);
    }

    return (
        <>
            <Toaster position="top-right" richColors className="pointer-events-auto" />
            <div key={item.id} className="flex items-center gap-4 py-2">
                <div className="flex flex-1 pl-2 pr-4 items-center">
                    <div className="w-7 cursor-pointer" onClick={() => onToggleItemDone(id)}>
                        {isDone ?
                            <CgRadioChecked size={22} className="text-amber-900 antialiased" />
                            : <CgRadioCheck size={22} className="text-amber-900 antialiased" />
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className={`ml-4 text-lg font-semibold ${isDone ? 'text-slate-400' : ''}`}>{item.title}</div>
                        <div className={`ml-4 text-[16px] ${isDone ? 'text-slate-400' : ''}`}>{item.description}</div>
                        <div className={`ml-4 mt-1 text-[14px] text-gray-500 ${isDone ? 'text-slate-400' : ''}`}>
                            {item.date
                                ? `Due date: ${(typeof item.date === 'string' ? new Date(item.date) : item.date).toLocaleDateString('sv-SE')}`
                                : ''
                            }
                        </div>
                    </div>
                </div>
                <div className="w-5 items-center cursor-pointer" onClick={() => onDeleteItem(id)}>
                    <RiDeleteBinLine className="text-[22px] text-gray-500 antialiased pr-0.5 hover:text-amber-900" />
                </div>
                <div className="w-5 items-center cursor-pointer mr-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <form>
                            <DialogTrigger asChild>
                                <AiOutlineEdit className="text-[22px] text-gray-500 antialiased hover:text-amber-900 cursor-pointer" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader className="sr-only">
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <Form
                                        title="Edit Item"
                                        description="Modify the details of your ToDo item."
                                        data={item}
                                        onSubmit={saveItem}
                                    />
                                </div>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
            </div >
            <Separator className="my-2" />
        </>
    )
}

export default ItemList;