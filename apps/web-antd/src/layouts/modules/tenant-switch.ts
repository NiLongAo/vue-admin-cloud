export interface TenantSelectOption {
  label: string;
  value: number | string;
}

interface TenantSelectRecord {
  id?: number | string;
  name?: string;
  tenantName?: string;
}

export function normalizeTenantOptions(
  records: TenantSelectRecord[] = [],
): TenantSelectOption[] {
  return records
    .filter((item) => item.id !== undefined && item.id !== null)
    .map((item) => ({
      label: item.name ?? item.tenantName ?? String(item.id),
      value: item.id as number | string,
    }));
}

export function getTenantRecords(response: unknown): TenantSelectRecord[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const data = (response as any).data;
  if (Array.isArray(data)) {
    return data;
  }

  return (response as any).list ?? (response as any).records ?? [];
}
