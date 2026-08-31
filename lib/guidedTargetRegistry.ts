"use client";

import { useEffect, useRef } from "react";

/**
 * Because only the active module is ever mounted (see app/page.tsx), a
 * guided-mode target living in a module the presenter hasn't navigated to
 * yet simply doesn't exist in the DOM. This registry lets the guided
 * runtime `await` a target's actual mount instead of guessing a delay after
 * a module switch — see plan decision #3.
 */

type Waiter = (el: HTMLElement) => void;

const targets = new Map<string, HTMLElement>();
const waiters = new Map<string, Waiter[]>();

function registerGuidedTarget(id: string, el: HTMLElement) {
  targets.set(id, el);
  const pending = waiters.get(id);
  if (pending?.length) {
    pending.forEach((resolve) => resolve(el));
    waiters.delete(id);
  }
}

function unregisterGuidedTarget(id: string, el: HTMLElement) {
  if (targets.get(id) === el) targets.delete(id);
}

export function waitForGuidedTarget(id: string, timeoutMs = 4000): Promise<HTMLElement> {
  const existing = targets.get(id);
  if (existing && existing.isConnected) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    let settled = false;

    const wrappedResolve: Waiter = (el) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(el);
    };

    const list = waiters.get(id) ?? [];
    list.push(wrappedResolve);
    waiters.set(id, list);

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      const current = waiters.get(id);
      if (current) {
        const idx = current.indexOf(wrappedResolve);
        if (idx !== -1) current.splice(idx, 1);
      }
      reject(new Error(`Guided target "${id}" did not appear within ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

/** Attach the returned ref to any interactive element the golden path can target. */
export function useGuidedTarget(id: string) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGuidedTarget(id, el);
    return () => unregisterGuidedTarget(id, el);
  }, [id]);

  return ref;
}
