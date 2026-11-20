import type { Experience } from './types';

/**
 * Name shown for the organisation of an item. Client missions are anonymous by default:
 * the real client name appears only if disclosure is "named" and a public name is set.
 */
export function displayClient(item: Pick<Experience, 'client'>): string | null {
  const client = item.client;
  if (!client) return null;
  if (client.disclosure === 'named' && client.publicName) return client.publicName;
  return client.descriptor;
}
