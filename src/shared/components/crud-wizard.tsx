import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const form = useForm({ defaultValues: initialData });

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
      <DialogContent className="bg-slate-950/90 border-slate-800 text-white max-w-lg backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {title ?? (mode === 'create' ? t('common.actions.create') : t('common.actions.edit'))}
          </DialogTitle>
          {description && <DialogDescription className="text-slate-400 text-sm leading-relaxed">{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-5 pt-4">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {fields.map((f) => (
                <FormField
                  key={f.name}
                  name={f.name}
                  rules={{ required: f.required }}
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-medium text-slate-300">
                          {f.label}
                          {f.required ? <span className="text-red-500 ml-1">*</span> : ''}
                        </FormLabel>
                        {f.hint && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-slate-500 cursor-help hover:text-cyan-400 transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200">{f.hint}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <FormControl>
                        {f.type === 'number' ? (
                          <Input
                            type="number"
                            {...field}
                            className="bg-slate-900/50 border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all"
                          />
                        ) : f.type === 'date' ? (
                          <Input
                            type="date"
                            {...field}
                            className="bg-slate-900/50 border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all"
                          />
                        ) : (
                          <Input
                            type="text"
                            {...field}
                            className="bg-slate-900/50 border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all"
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter className="pt-6 border-t border-slate-800/50">
              <Button
                variant="ghost"
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {t('common.actions.cancel')}
              </Button>
              <Button
                type="submit"
                className="ml-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20 px-8"
              >
                {mode === 'create' ? t('common.actions.create') : t('common.actions.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CrudWizard;
