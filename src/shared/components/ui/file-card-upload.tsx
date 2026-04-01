import React, { useRef, useState, useEffect } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { attachmentsService, type AttachmentType } from '@/shared/services/attachments.service';

interface FileCardUploadProps {
    label: string;
    type: AttachmentType;
    value?: string | null; // attachmentId
    previewUrl?: string | null; // initial existing URL
    onUploadSuccess: (attachmentId: string) => void;
    onRemove: () => void;
    size?: string; // e.g. 'w-32 h-32' or 'w-40 h-40'
    placeholderIcon: React.ReactNode;
    description?: string;
    className?: string;
    maxSizeMB?: number;
}

export function FileCardUpload({
    label,
    type,
    value,
    previewUrl: initialPreviewUrl,
    onUploadSuccess,
    onRemove,
    size = 'w-32 h-32',
    placeholderIcon,
    description,
    className,
    maxSizeMB = 2,
}: FileCardUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync initial preview if provided from parent (e.g. from server)
    const effectivePreview = localPreview || initialPreviewUrl;

    // Cleanup local blob URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (localPreview && localPreview.startsWith('blob:')) {
                URL.revokeObjectURL(localPreview);
            }
        };
    }, [localPreview]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image size must be less than ${maxSizeMB}MB`);
            return;
        }

        setIsUploading(true);
        
        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);

        try {
            // 3-step secure upload flow: Initialize -> Binary PUT -> Confirm
            const attachmentId = await attachmentsService.uploadFile(file, type);
            onUploadSuccess(attachmentId);
            toast.success(`${label} uploaded and ready to save`);
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(err?.message || `Failed to upload ${label.toLowerCase()}`);
            
            // Revert on failure
            setLocalPreview(null);
            URL.revokeObjectURL(objectUrl);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        if (localPreview && localPreview.startsWith('blob:')) {
            URL.revokeObjectURL(localPreview);
        }
        setLocalPreview(null);
        onRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn("space-y-4 shrink-0 mx-auto lg:mx-0", className)}>
            <Label className="text-slate-300 block text-center lg:text-left">{label}</Label>
            <div className="relative group">
                <div className={cn(
                    size,
                    "relative border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden transition-all duration-300 bg-slate-900/80 shadow-inner rounded-none",
                    !effectivePreview && "hover:border-cyan-500/50 hover:bg-slate-900",
                    effectivePreview && "border-solid border-slate-600 shadow-xl shadow-cyan-500/5"
                )}>
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-center p-2">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest">Optimizing</span>
                        </div>
                    ) : effectivePreview ? (
                        <img 
                            src={effectivePreview} 
                            alt={label} 
                            className="w-full h-full object-cover rounded-none" 
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-600">
                            <div className="transition-colors group-hover:text-slate-400">
                                {placeholderIcon}
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-tighter">No {label.split(' ').pop()}</span>
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    {!isUploading && (
                        <div 
                            className="absolute inset-0 bg-cyan-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm rounded-none" 
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Camera className="h-8 w-8 text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Replace</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleUpload}
                />

                {/* Remove Button */}
                {effectivePreview && !isUploading && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg border border-red-400/50"
                        title={`Remove ${label.toLowerCase()}`}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            {description && (
                <p className="text-[10px] text-slate-500 text-center lg:text-left">{description}</p>
            )}
        </div>
    );
}
