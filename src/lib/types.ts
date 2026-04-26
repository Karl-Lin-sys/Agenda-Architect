/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stakeholder {
  name: string;
  role: string;
  avatar?: string;
}

export interface AgendaTopic {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startTime?: string;
  endTime?: string;
  speaker?: string;
}

export interface Agenda {
  title: string;
  stakeholders: Stakeholder[];
  topics: AgendaTopic[];
  totalDuration: number;
}
