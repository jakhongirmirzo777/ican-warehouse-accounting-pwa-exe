declare module 'virtual:pwa-register/vue' {
  // @ts-expect-error ignore when vue is not installed
  import type { Ref } from 'vue'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    // eslint-disable-next-line no-unused-vars
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    // eslint-disable-next-line no-unused-vars
    onRegisterError?: (error: Error) => void
  }

  // eslint-disable-next-line no-unused-vars
  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    // eslint-disable-next-line no-unused-vars
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
