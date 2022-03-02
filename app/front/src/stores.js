import {writable} from 'svelte/store';

export const currentPageId = writable("test");
export const currentModal = writable("");
export const sidenavOpen = writable(true);

export const deviceStore = writable([]);

export const token = writable("");