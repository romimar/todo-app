import { useEffect, useMemo, useState } from "react";
import type { Item } from "@/types/formDataType";
import type { FormDataType } from "@/types/formDataType";
import Form from "./shared/Form";
import ItemRow from "./ItemRow";
import InputSearch from "./shared/InputSearch";
import ListPagination from "./ListPagination";
import { Toggle } from "./ui/toggle";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import { Button } from "./ui/button";

const getTime = (d?: Date): number => {
    if (!d) return Number.MAX_SAFE_INTEGER;
    if (isNaN(d.getTime())) return Number.MAX_SAFE_INTEGER;
    return d.getTime();
};

const compareDueDate = (a: Item, b: Item) => getTime(a.date) - getTime(b.date);

const parseItemDate = (item: Item): Item => {
    let date: Date | undefined;
    const raw = item.date as unknown as any;
    if (raw) {
        if (raw instanceof Date) {
            date = raw;
        } else if (typeof raw === 'string') {
            if (raw.trim()) {
                const d = new Date(raw);
                date = isNaN(d.getTime()) ? undefined : d;
            }
        }
    }
    return { ...item, date };
};

const TodoContainer = () => {
    const [itemsList, setItemsList] = useState<Item[]>([]);
    const [searchedTerm, setSearchedTerm] = useState<string>('');
    const [pressed, setPressed] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage,] = useState(4);
    const [showCompleted, setShowCompleted] = useState(false);

    const filtered = useMemo(() => {
        const q = searchedTerm.toLowerCase();
        const result = itemsList.filter(
            (i) =>
                i.title?.toLowerCase().includes(q) ||
                i.description?.toLowerCase().includes(q)
        );

        const visibilityFiltered = showCompleted ? result : result.filter(i => !i.isDone);
        return visibilityFiltered;
    }, [itemsList, searchedTerm, showCompleted]);

    const displayItems = useMemo(
        () => {
            const result = pressed ? [...filtered].sort(compareDueDate) : filtered;
            return result;
        },
        [filtered, pressed]
    );

    const totalPages = Math.max(1, Math.ceil(displayItems.length / rowsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    useEffect(() => {
        (async () => {
            const res = await axios.get('/api/items');
            const data = res.data as Item[];
            setItemsList(data.map(parseItemDate));
        })();
    }, []);

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const items = displayItems.slice(start, start + rowsPerPage);
        return items;
    }, [displayItems, currentPage, rowsPerPage]);

    const saveItem = async (formData: FormDataType | Item): Promise<void> => {
        try {
            const response = await axios.post('/api/items', {
                title: formData.title,
                description: formData.description,
                date: formData.date ? formData.date.toISOString() : undefined,
                isDone: false,
            });

            const newItem = parseItemDate(response.data);
            setItemsList(prev => [...prev, newItem]);
            toast.success(`Item "${formData.title}" has been created.`);
        } catch (error) {
            console.error("Error creating item:", error);
            toast.error("Error creating the item.");
        }
    };

    const editItem = async (id: number, data: Item) => {
        try {
            const response = await axios.put(`/api/items/${id}`, {
                ...data,
                date: data.date ? data.date.toISOString() : undefined
            });

            const updated = parseItemDate(response.data);
            setItemsList(prev => prev.map(it => (it.id === id ? updated : it)));
            toast.success(`Item "${data.title}" has been updated.`);
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error("Error updating the item.");
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await axios.delete(`/api/items/${id}`);
            setItemsList(prev => prev.filter(item => item.id !== id));
            toast.success(`Item has been deleted.`);
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error deleting the item.");
        }
    };

    const toggleItemDone = async (id: number) => {
        const item = itemsList.find(i => i.id === id);
        if (!item) return;
        try {
            const response = await axios.put(`/api/items/${id}`, {
                ...item,
                isDone: !item.isDone,
                date: item.date ? item.date.toISOString() : undefined
            });
            const updatedItem = parseItemDate(response.data);
            setItemsList(prev => prev.map(i => i.id === id ? updatedItem : i));
        } catch (error) {
            console.error("Error toggling item:", error);
            toast.error("Error updating the item.");
        }
    };

    const handleSearch = (q: string) => {
        setSearchedTerm(q);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const populateList = async () => {
        try {
            const response = await axios.post('/api/items', {
                title: "Sample Item",
                description: "This is a sample TODO item",
                date: new Date().toISOString(),
                isDone: false,
            });

            setItemsList(prev => [...prev, parseItemDate(response.data)]);
            toast.success("Sample Item has been added.");
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Error adding the item.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-screen gap-6 w-full lg:flex-row sm:p-6 lg:p-8 sm:gap-6">
            <div className="bg-white lg:h-[700px] rounded-md p-6 sm:p-8 w-full lg:w-1/3">
                <Form
                    onSubmit={saveItem}
                    title="ToDo App"
                    description="Create a new item and organize your tasks effectively."
                />
            </div>
            <div className="flex flex-col lg:w-[800px] bg-white rounded-md p-8 overflow-y-auto h-auto sm:p-8 lg:h-[700px]">
                <div className="flex items-center justify-center mb-4">
                    <InputSearch onSearchParam={handleSearch} />
                </div>
                <div className="flex flex-row align-middle justify-end gap-4 mb-4 sm:gap-4">
                    <div className="flex flex-row text-[14px] items-start gap-1">
                        {itemsList.some(i => i.isDone) && (
                            <div className="flex flex-row items-baseline gap-1">
                                <div className="text-slate-600 hidden sm:block">
                                    {`${itemsList.filter(i => i.isDone).length} Completed `} <span className="font-bold text-[15px] mx-1">&#183;</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => { setShowCompleted(v => !v); setCurrentPage(1); }}
                                    className="hover:text-amber-900 cursor-pointer px-0"
                                    size="sm"
                                >
                                    {showCompleted ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row gap-2 w-full sm:w-auto justify-end">
                        <Toggle
                            aria-label="Toggle date sort"
                            size="sm"
                            variant="default"
                            pressed={pressed}
                            onPressedChange={(value) => {
                                setPressed(value);
                                setCurrentPage(1);
                            }}
                            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-amber-900 data-[state=on]:*:[svg]:stroke-amber-900"
                        >
                            <ArrowUpDown className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sort by due date</span>
                        </Toggle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={populateList}
                            className="cursor-pointer"
                            size="sm"
                        >
                            <span className="hidden sm:inline">Generate Item</span>
                            <span className="sm:hidden">+</span>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col justify-start overflow-y-auto h-[400px] sm:h-[500px]">
                    {pageItems.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No items found.
                        </div>
                    )}
                    {pageItems.map((item) => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            id={item.id}
                            isDone={item.isDone}
                            onDeleteItem={deleteItem}
                            onToggleItemDone={toggleItemDone}
                            onSaveEditedItem={editItem}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-center align-baseline mt-4">
                    <ListPagination
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        totalItems={displayItems.length}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div >
    );
};

export default TodoContainer;