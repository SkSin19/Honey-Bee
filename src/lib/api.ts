import type { InputFormat, Subject } from '@/lib/config';

export interface AnalyzeInput {
  base64: string;
  format: InputFormat;
  subject: Subject;
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

const endpoint = (baseUrl: string, path: string) => `${baseUrl.trim().replace(/\/+$/, '')}${path}`;

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (controller.signal.aborted) {
      throw new Error('The server took too long to respond.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function analyzeProblem(baseUrl: string, input: AnalyzeInput): Promise<AnalyzeResult> {
  const res = await fetchWithTimeout(endpoint(baseUrl, '/pipeline_start'), 120_000, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: input.base64, type: input.format, subject: input.subject }),
  });

  if (!res.ok) {
    throw new Error(`The server responded with ${res.status}.`);
  }
  return (await res.json()) as AnalyzeResult;
}

export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(endpoint(baseUrl, '/health'), 5_000);
    return res.ok;
  } catch {
    return false;
  }
}
