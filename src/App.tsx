/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UploadPanel } from './components/UploadPanel';
import { AgendaView } from './components/AgendaView';
import { Agenda } from './lib/types';
import { analyzeDocument } from './services/geminiService';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [history, setHistory] = useState<{ name: string; date: string }[]>([]);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove the data:mime;base64, prefix
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;

      // Analyze with Gemini
      const result = await analyzeDocument(base64, file.type);
      setAgenda(result);
      
      // Update history
      const now = new Date().toLocaleString([], { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      setHistory(prev => [{ name: file.name, date: now }, ...prev].slice(0, 5));
      
      toast.success('Agenda architected successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
        <UploadPanel 
          onUpload={handleUpload} 
          isProcessing={isProcessing} 
          history={history} 
        />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <AgendaView agenda={agenda} />
          
          {/* Subtle Branding/Footer Overlay */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 pointer-events-none opacity-20 hover:opacity-50 transition-opacity">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Agenda Architect</span>
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span className="text-[10px] font-mono">v1.0.0</span>
          </div>
        </main>
        <Toaster position="bottom-right" closeButton theme="light" />
      </div>
    </TooltipProvider>
  );
}
