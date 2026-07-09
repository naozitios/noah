import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(public code: string, message: string, public status: number = 500) {
    super(message);
  }
}

export function handleError(err: unknown) {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.status },
    );
  }

  console.error('Unhandled error:', err);
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 },
  );
}
