import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item } from "@/types/formDataType";
import type { FormDataType } from "@/types/formDataType";
import Form from "./shared/Form";
import ItemRow from "./ItemRow";
import InputSearch from "./shared/InputSearch";
import ListPagination from "./ListPagination";
import { Toggle } from "./ui/toggle";
import { ArrowUpDown } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import axios from 'axios';
import { Button } from "./ui/button";

const getTime = (d?: Date | string): number => {
    if (!d) return Number.MAX_SAFE_INTEGER;
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return Number.MAX_SAFE_INTEGER;
    return date.getTime();
};

const compareDueDate = (a: Item, b: Item) => getTime(a.date) - getTime(b.date);

const parseItemDate = (item: Item): Item => {
    let date: Date | undefined;
    const raw = item.date;
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
    const queryClient = useQueryClient();
    const toast = useToast();
    const [searchedTerm, setSearchedTerm] = useState<string>('');
    const [pressed, setPressed] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage,] = useState(4);
    const [showCompleted, setShowCompleted] = useState(false);

    const { data: itemsList = [] } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const res = await axios.get('/api/items');
            const data = res.data as Item[];
            return data.map(parseItemDate);
        }
    });

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

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const items = displayItems.slice(start, start + rowsPerPage);
        return items;
    }, [displayItems, currentPage, rowsPerPage]);

    const createMutation = useMutation({
        mutationFn: async (formData: FormDataType | Item) => {
            const response = await axios.post('/api/items', {
                title: formData.title,
                description: formData.description,
                date: formData.date
                    ? (typeof formData.date === 'string' ? formData.date : formData.date.toISOString())
                    : undefined,
                isDone: false,
            });
            return parseItemDate(response.data);
        },
        onSuccess: (_, formData) => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success(`Item "${formData.title}" has been created.`);
        },
        onError: () => {
            toast.error("Error creating the item.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Item }) => {
            const response = await axios.put(`/api/items/${id}`, {
                ...data,
                date: data.date
                    ? (typeof data.date === 'string' ? data.date : data.date.toISOString())
                    : undefined
            });
            return parseItemDate(response.data);
        },
        onSuccess: (_, { data }) => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success(`Item "${data.title}" has been updated.`);
        },
        onError: () => {
            toast.error("Error updating the item.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/items/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast.success(`Item has been deleted.`);
        },
        onError: () => {
            toast.error("Error deleting the item.");
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async (id: number) => {
            const item = itemsList.find(i => i.id === id);
            if (!item) throw new Error('Item not found');

            const response = await axios.put(`/api/items/${id}`, {
                ...item,
                isDone: !item.isDone,
                date: item.date
                    ? (typeof item.date === 'string' ? item.date : item.date.toISOString())
                    : undefined
            });
            return parseItemDate(response.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
        onError: () => {
            toast.error("Error updating the item.");
        }
    });

    const saveItem = async (formData: FormDataType | Item): Promise<void> => {
        createMutation.mutate(formData);
    };

    const editItem = async (id: number, data: Item) => {
        updateMutation.mutate({ id, data });
    };

    const deleteItem = async (id: number) => {
        deleteMutation.mutate(id);
    };

    const toggleItemDone = async (id: number) => {
        toggleMutation.mutate(id);
    };

    const handleSearch = (q: string) => {
        setSearchedTerm(q);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                            className="data-[state=on]:bg-transparent cursor-pointer data-[state=on]:*:[svg]:fill-amber-900 data-[state=on]:*:[svg]:stroke-amber-900"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Sort by due date</span>
                        </Toggle>
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
        </div>
    );
};

export default TodoContainer;