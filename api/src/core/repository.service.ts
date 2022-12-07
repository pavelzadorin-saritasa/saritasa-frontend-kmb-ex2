import PG from 'pg';

const dbClient = new PG.Client();

/** Init app repository. */
export async function connectRepository() {
  await dbClient.connect();
}

/** Disconnect to repository. */
export async function disconnectRepository() {
  await dbClient.end();
}

/**
 * Execute query to repository.
 * @param q Query text.
 * @param params Query parameters.
 * @returns Set of entities related to query.
 */
export async function query(q: string, params: string[]) {
  return await (await dbClient.query(q, params)).rows; 
}
