import { TransactionError } from './errors';

/**
 * Generic transaction wrapper.
 * - Keeps your service code consistent
 * - Preserves the original error as `cause`
 * - Supports custom error mapping/logging if you want
 */
export async function withTransaction<TTx, TResult>(
  db: { transaction: <T>(fn: (tx: TTx) => Promise<T>) => Promise<T> },
  fn: (tx: TTx) => Promise<TResult>,
  opts?: {
    errorMessage?: string;
    mapError?: (err: unknown) => Error;
    onError?: (err: unknown) => void;
  }
): Promise<TResult> {
  try {
    return await db.transaction(async (tx) => fn(tx));
  } catch (err) {
    opts?.onError?.(err);

    if (opts?.mapError) throw opts.mapError(err);

    throw new TransactionError(opts?.errorMessage ?? 'Transaction failed', err);
  }
}
