import type { InputFormat } from '@/lib/config';

export interface AnalyzeInput {
  base64: string;
  format: InputFormat;
  subject: string;
}

export interface MathError {
  statement: string;
  claimed: string;
  correct: string;
}

export interface AnalyzeResult {
  text: string;
  subject: string;
  type: string;
  verdict: 'correct' | 'error' | 'unknown';
  error_type: string | null;
  confidence: number | null;
  math: {
    verdict: 'correct' | 'error' | 'unknown';
    checked: number;
    errors: MathError[];
  };
}

export async function analyzeProblem(
  baseUrl: string,
  input: AnalyzeInput,
): Promise<AnalyzeResult> {
  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/pipeline_start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: input.base64,
      type: input.format,
      subject: input.subject,
    }),
  });

  if (!res.ok) {
    throw new Error(`The server responded with ${res.status}.`);
  }

  return (await res.json()) as AnalyzeResult;
}

export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
