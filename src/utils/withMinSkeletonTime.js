/** Keeps skeleton loaders visible for at least `ms` milliseconds. */
export async function withMinSkeletonTime(startedAt, ms = 3000) {
  const elapsed = Date.now() - startedAt;
  const wait = Math.max(0, ms - elapsed);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}
