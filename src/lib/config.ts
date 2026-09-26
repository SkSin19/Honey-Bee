import { Platform } from 'react-native';

const fallback =
  Platform.OS === 'android' ? 'http://10.21.33.213:8001' : 'http://10.21.33.213:8001';

export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL ?? fallback;

export const SUBJECTS = [
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'Programming',
  'English',
  'History',
  'Geography',
  'General',
] as const;

export const FORMATS = [
  { key: 'handwritten', label: 'Handwritten' },
  { key: 'printed_math', label: 'Printed math' },
  { key: 'plain', label: 'Plain text' },
] as const;

export type InputFormat = (typeof FORMATS)[number]['key'];

export const ERROR_LABELS: Record<string, string> = {
  calculation_error: 'Calculation slip',
  conceptual_misunderstanding: 'Concept mix-up',
  sign_error: 'Sign error',
  order_of_operations_error: 'Order of operations',
  unit_error: 'Units',
  wrong_method_or_formula: 'Wrong method',
  incomplete_or_omission: 'Unfinished or missing a step',
  misread_question: 'Misread the question',
  logical_reasoning_error: 'Reasoning slip',
  factual_error: 'Factual error',
  language_or_grammar_error: 'Grammar',
  syntax_error: 'Code syntax',
};

export function prettyError(key: string | null): string {
  if (!key) {
    return 'Mistake';
  }
  return ERROR_LABELS[key] ?? key;
}
