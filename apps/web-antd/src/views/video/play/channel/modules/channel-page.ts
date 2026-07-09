import type { DeviceChannelEntity } from '#/api/video/deviceChannel';

interface NormalizedChannelPage {
  items: DeviceChannelEntity[];
  total: number;
}

function asArray(value: unknown): DeviceChannelEntity[] {
  return Array.isArray(value) ? (value as DeviceChannelEntity[]) : [];
}

export function normalizeDeviceChannelPageResult(
  result: unknown,
): NormalizedChannelPage {
  if (Array.isArray(result)) {
    return {
      items: result,
      total: result.length,
    };
  }

  if (!result || typeof result !== 'object') {
    return {
      items: [],
      total: 0,
    };
  }

  const record = result as Record<string, unknown>;
  const pageCandidates = [
    asArray(record.items),
    asArray(record.data),
    asArray(record.records),
  ];
  const items =
    pageCandidates.find((candidate) => candidate.length > 0) ??
    asArray(record.list);

  return {
    items,
    total: Number(record.total ?? items.length),
  };
}
