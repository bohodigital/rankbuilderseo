export function stableEntries<T>(items: readonly T[], scope: string, signature: (value: T) => string) {
  const occurrenceBySignature = new Map<string, number>();
  return items.map((value) => {
    const keyData = encodeURIComponent(signature(value));
    const occurrence = occurrenceBySignature.get(keyData) ?? 0;
    occurrenceBySignature.set(keyData, occurrence + 1);
    return { key: `${scope}-${keyData}-${occurrence}`, value };
  });
}

export function semanticSignature(value: unknown): string {
  return JSON.stringify(value);
}
