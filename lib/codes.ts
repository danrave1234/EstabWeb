import { customAlphabet } from 'nanoid/non-secure';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVXYZ23456789';
const randomPart = customAlphabet(ALPHABET, 6);

export const generateTemplateCode = (prefix?: string) => {
  const part = randomPart();
  const trimmed = (prefix ?? '').trim();
  return trimmed ? `${trimmed.toUpperCase()}-${part}` : part;
};

export const generateSubdomain = (email: string) => {
  const prefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const part = randomPart().toLowerCase();
  return `${prefix}-${part}`;
};
