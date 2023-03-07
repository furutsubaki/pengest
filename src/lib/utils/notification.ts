import { toast } from '@zerodevx/svelte-toast';

const defaultOptions = {
    pausable: true,
    // reversed: true,
};

export const info = (m: string) => toast.push(m, {
    classes: ['info'],
    ...defaultOptions,
});

export const success = (m: string) => toast.push(m, {
    classes: ['success'],
    ...defaultOptions,
});

export const warning = (m: string) => toast.push(m, {
    classes: ['warning'],
    ...defaultOptions,
});

export const danger = (m: string) => toast.push(m, {
    classes: ['danger'],
    ...defaultOptions,
});
