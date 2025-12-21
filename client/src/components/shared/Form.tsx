import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "../ui/field";
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import type { FormDataType, Item } from "@/types/formDataType";

const todoSchema = z.object({
    title: z.string().min(1, 'Title must be at least 1 character long'),
    description: z.string().min(1, 'Description must be at least 1 character long'),
    date: z.date(),
});

type FormValues = z.infer<typeof todoSchema>;

interface FormProps {
    title?: string;
    description?: string;
    data?: Item | null;
    onSubmit: (data: FormDataType | Item) => void;
}

const Form = ({ title, description, data, onSubmit }: FormProps) => {
    const [open, setOpen] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: data ? data.title : '',
            description: data ? data.description : '',
            date: data && data.date ? (typeof data.date === 'string' ? new Date(data.date) : data.date) : undefined,
        },
    })

    const onSendingData = (data: FormValues) => {
        onSubmit(data);
        form.reset();
    };

    return (
        <div className="flex flex-col my-2">
            <form
                onSubmit={form.handleSubmit(onSendingData)}
            >
                <FieldSet>
                    <FieldTitle className="text-[22px] font-extrabold">{title}</FieldTitle>
                    <FieldDescription className="text-[15px]">{description}</FieldDescription>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="title">Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id="title"
                                        placeholder="Add a title"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError>{fieldState.error?.message}</FieldError>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <Input
                                        {...field}
                                        id="description"
                                        placeholder="Add a description"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError>{fieldState.error?.message}</FieldError>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="date">Due date</FieldLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                id="date"
                                                variant="outline"
                                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal cursor-pointer"
                                            >
                                                {field.value && field.value instanceof Date ? format(field.value, 'MMM dd, yyyy') : "Select date"}
                                                <CalendarIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value instanceof Date ? field.value : undefined}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    setOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {fieldState.invalid && (
                                        <FieldError>{fieldState.error?.message}</FieldError>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>
                <Field orientation="responsive" className="mt-6">
                    <Button
                        type="submit"
                        className="bg-amber-900 text-white mt-2 hover:bg-amber-800 cursor-pointer"
                    >
                        {!data ? 'Create Item' : 'Save Changes'}
                    </Button>
                </Field>
            </form>
        </div >
    )
}

export default Form;