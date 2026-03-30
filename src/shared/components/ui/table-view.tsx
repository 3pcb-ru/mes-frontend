import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface TableViewOptions {
    value: string;
    label: string;
}

interface TableViewProps {
    /** The currently selected UUID */
    value?: string;
    /** Callback fired when a new UUID is selected */
    onChange: (currentValue: string) => void;
    /** Async function to fetch the data. Should return an array of objects to be mapped. */
    fetchData: () => Promise<any[]>;
    /** Optional function to map the raw API data objects to { value (uuid), label (name) } pairs.
     * Defaults to item => { value: item.id, label: item.name }
     */
    mapData?: (item: any) => TableViewOptions;
    /** Placeholder text for the trigger button */
    placeholder?: string;
    /** Custom CSS classes for the trigger button */
    className?: string;
    /** If true, the border will be styled red for validation errors */
    hasError?: boolean;
    /** Optional initial label to show when only the UUID is available and data hasn't been fetched yet. */
    initialLabel?: string;
}

export function TableView({
    value,
    onChange,
    fetchData,
    mapData = (item) => ({ value: item.id, label: item.name }),
    placeholder = 'Select an option...',
    className,
    hasError,
    initialLabel,
}: TableViewProps) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<TableViewOptions[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);

    // Initial load when opened
    React.useEffect(() => {
        if (!open || hasFetched) return;
        
        let active = true;
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await fetchData();
                if (active) {
                    setOptions(Array.isArray(data) ? data.map(mapData) : []);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('TableView fetch error:', error);
                if (active) setOptions([]);
            } finally {
                if (active) setIsLoading(false);
            }
        };
        
        load();
        return () => { active = false; };
    }, [open, hasFetched, fetchData, mapData]);

    const selectedOption = React.useMemo(() => 
        options.find((opt) => opt.value === value),
    [options, value]);

    // Handle the case where we have a value but haven't fetched options yet
    // The parent might have set an initial value. We want to show it nicely if possible,
    // but without fetching the whole list immediately. If it's a UUID, it's not pretty,
    // but the moment they open the dropdown it will fetch and find the label.
    const displayValue = selectedOption?.label || initialLabel || value;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={hasError}
                    className={cn(
                        "w-full justify-between bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-white font-normal",
                        !value && "text-slate-500",
                        hasError && "border-destructive ring-destructive/20 focus-visible:ring-destructive/50",
                        className
                    )}
                >
                    <span className="truncate">
                        {value ? displayValue : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-slate-900 border-slate-700" align="start">
                <Command className="bg-transparent text-slate-300">
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                </div>
                            ) : (
                                "No options found."
                            )}
                        </CommandEmpty>
                        {!isLoading && (
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label || option.value}
                                        onSelect={() => {
                                            onChange(option.value === value ? "" : option.value);
                                            setOpen(false);
                                        }}
                                        className="text-slate-300 hover:text-white"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100 text-cyan-500" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
