import clsx, { type ClassValue } from 'clsx';
/** Tiny wrapper so all components have one consistent classname helper. */
export const cn = (...args: ClassValue[]) => clsx(args);
