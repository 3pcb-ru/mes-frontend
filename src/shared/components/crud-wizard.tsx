import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  required?: boolean;
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
              <FormField key={f.name} name={f.name}>
                <FormItem>
                  <FormLabel>{f.label}{f.required ? ' *' : ''}</FormLabel>
                  <FormControl>
                    {f.type === 'number' ? (
                      <Input type="number" {...form.register(f.name, { required: f.required })} />
                    ) : (
                      <Input type="text" {...form.register(f.name, { required: f.required })} />
                    )}
                  </FormControl>
                </FormItem>
              </FormField>
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
