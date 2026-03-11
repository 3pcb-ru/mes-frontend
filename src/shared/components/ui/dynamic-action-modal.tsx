import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Abstracted structure for capability fields
export interface CapabilityField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: { label: string; value: string }[];
    required?: boolean;
}

export interface DynamicActionModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title: string;
    description?: string;
    fields: CapabilityField[];
    onSubmit: (data: Record<string, string | number>) => void;
    isLoading?: boolean;
}

export function DynamicActionModal({ open, onOpenChange, trigger, title, description, fields, onSubmit, isLoading }: DynamicActionModalProps) {
    const [formData, setFormData] = React.useState<Record<string, string | number>>({});

    // Reset form when opened
    React.useEffect(() => {
        if (open) {
            setFormData({});
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>
                                    {field.label} {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                {field.type === 'select' && field.options ? (
                                    <Select
                                        onValueChange={(val) => setFormData((prev) => ({ ...prev, [field.name]: val }))}
                                        required={field.required}
                                        value={(formData[field.name] as string) || ''}>
                                        <SelectTrigger id={field.name}>
                                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        required={field.required}
                                        value={formData[field.name] || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                                            }))
                                        }
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
