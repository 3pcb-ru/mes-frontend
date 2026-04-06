import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Info } from 'lucide-react';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date';
  required?: boolean;
  hint?: string;
  options?: { label: string; value: string }[];
};

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  mode?: 'create' | 'edit';
  fields: Field[];
  initialData?: Record<string, any>;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
};

export function CrudWizard({ isOpen, title, description, mode = 'create', fields, initialData = {}, onClose, onSubmit }: Props) {
  const form = useForm({ defaultValues: initialData });

  // Reset form when initialData or mode changes
  useEffect(() => {
    if (isOpen) {
      form.reset(initialData);
    }
  }, [isOpen, initialData, form]);

  const submit = async (values: any) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? (mode === 'create' ? 'Create item' : 'Edit item')}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4 pt-4">
            {fields.map((f) => (
              <FormField
                key={f.name}
                name={f.name}
                rules={{ required: f.required }}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>
                        {f.label}
                        {f.required ? ' *' : ''}
                      </FormLabel>
                      {f.hint && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{f.hint}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <FormControl>
                      {f.type === 'number' ? (
                        <Input type="number" {...field} />
                      ) : f.type === 'date' ? (
                        <Input type="date" {...field} />
                      ) : (
                        <Input type="text" {...field} />
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter>
              <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="ml-2">{mode === 'create' ? 'Create' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CrudWizard;
