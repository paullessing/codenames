import { derived, writable } from 'svelte/store';

export enum ToastType {
  INFO = 'info',
  ERROR = 'error',
}

export interface ToastConfig {
  text: string;
  type: ToastType;
}

const toasts = writable<ToastConfig[]>([]);
export const toast = derived<typeof toasts, ToastConfig | null>(toasts, (toasts) => toasts[0] ?? null, null);

type AddMessageParams = Pick<ToastConfig, 'text'> & {
  [Property in keyof ToastConfig]?: ToastConfig[Property];
};

export const showToast = (toast: AddMessageParams): void => {
  const config: ToastConfig = {
    ...toast,
    type: toast.type ?? ToastType.INFO,
  };
  toasts.update((toasts: ToastConfig[]) => toasts.concat(config));
};

export const dismissFirstToast = () => {
  toasts.update(([, ...rest]) => rest);
};
