export const encodeName = (name: string) => 'encoded_' + btoa(name).replace(/=/g, '');
