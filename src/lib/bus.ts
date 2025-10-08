// src/lib/bus.ts

type Listener = (payload: unknown) => void;

class Bus {
  private listeners = new Set<Listener>();
  on(fn: Listener) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(payload: unknown) { for (const fn of this.listeners) fn(payload); }
}

export const bus = new Bus();
export type EventPayload =
  | { type: "eventUpdated"; eventId: number }
  | { type: "bulkInvalidate" };
