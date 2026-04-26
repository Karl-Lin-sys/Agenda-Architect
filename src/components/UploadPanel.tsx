/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import { FileUp, Loader2, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface UploadPanelProps {
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
  history: { name: string; date: string }[];
}

export function UploadPanel({ onUpload, isProcessing, history }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await onUpload(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
  };

  return (
    <div className="flex flex-col h-full w-80 border-r bg-muted/30 p-6 gap-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Documents</h2>
        <p className="text-xs text-muted-foreground">Upload any document to architect your agenda</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 aspect-square flex flex-col items-center justify-center gap-4 p-8 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        <div className={`p-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <FileUp className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            {isProcessing ? 'Processing...' : 'Drop file here'}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            PDF, DOCX, TXT
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h3>
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {history.length === 0 ? (
              <p className="text-xs italic text-muted-foreground py-4">No recent uploads</p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="group flex flex-col gap-1 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors cursor-default">
                  <span className="text-sm font-medium truncate">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest py-6" disabled={isProcessing}>
        <Upload className="w-4 h-4 mr-2" />
        New Upload
      </Button>
    </div>
  );
}
