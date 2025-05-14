export const logger = {
  log: (message: string, ...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.log(message, ...args);
    } else {
      // Log en production - vous pouvez adapter selon vos besoins
      console.log('[PROD]', message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error('[ERROR]', message, ...args);
  }
};