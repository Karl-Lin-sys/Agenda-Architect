/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Clock, Users, Calendar, ArrowRight, UserCircle2, CheckCircle2 } from 'lucide-react';
import { Agenda } from '../lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AgendaViewProps {
  agenda: Agenda | null;
}

export function AgendaView({ agenda }: AgendaViewProps) {
  if (!agenda) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">No Agenda Architected</h3>
            <p className="text-muted-foreground">Upload a document on the left to generate a precise meeting timeline, stakeholders, and time-boxed topics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-background">
      <div className="max-w-5xl mx-auto p-12 space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold border-primary/20 text-primary">
              Intelligent Agenda
            </Badge>
            <div className="h-px flex-1 bg-muted/50" />
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {agenda.totalDuration} minutes
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none uppercase italic">
            {agenda.title}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Timeline */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Timeline Sequence</h2>
              <div className="h-4 w-px bg-muted" />
              <span className="text-[10px] font-mono opacity-50 uppercase">01 — Step by step</span>
            </div>

            <div className="relative space-y-0">
              {/* Timeline Line */}
              <div className="absolute left-[21px] top-4 bottom-4 w-px bg-border/50" />
              
              {agenda.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-14 pb-12 group last:pb-0"
                >
                  <div className="absolute left-0 top-1 p-1 bg-background border rounded-full z-10 group-hover:border-primary transition-colors">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold tracking-tight leading-tight uppercase group-hover:text-primary transition-colors">
                            {topic.title}
                          </h3>
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono">
                            {topic.durationMinutes}m
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                          {topic.description}
                        </p>
                      </div>
                      {topic.speaker && (
                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-transparent hover:border-primary/20 transition-all cursor-default">
                          <UserCircle2 className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[11px] font-medium">{topic.speaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-10">
            {/* Stakeholders */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Stakeholders</h2>
                <div className="h-4 w-px bg-muted" />
                <span className="text-[10px] font-mono opacity-50 uppercase">02 — Roles</span>
              </div>
              
              <div className="grid gap-3">
                {agenda.stakeholders.map((person, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.05) }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card/50 hover:bg-card transition-colors group"
                  >
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-bold leading-none">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{person.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Actions / Summary */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Meeting Stats</h2>
                <div className="h-4 w-px bg-muted" />
                <span className="text-[10px] font-mono opacity-50 uppercase">03 — Overview</span>
              </div>

              <Card className="p-6 bg-primary/5 border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Total Focus</span>
                  <span className="text-2xl font-black">{agenda.totalDuration}′</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-primary/10 pt-4">
                  <span className="opacity-50">Topic Count</span>
                  <span className="font-bold">{agenda.topics.length} Segments</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-primary/10 pt-4">
                  <span className="opacity-50">Stakeholders</span>
                  <span className="font-bold">{agenda.stakeholders.length} Identified</span>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
