/** Ciclo del envío del mensaje de contacto: reposo → enviando → enviado o fallido. */
export type SendStatus = 'idle' | 'sending' | 'sent' | 'failed';
