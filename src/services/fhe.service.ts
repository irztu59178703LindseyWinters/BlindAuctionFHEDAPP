// Minimal wrapper for @fhevm/sdk. Replace internals with real SDK calls.
// This file keeps the API stable for the React components.

export type ExternalEuint32Payload = {
  externalEuint32: any
  proof: string | Uint8Array
}

export async function encryptBid(value: number): Promise<ExternalEuint32Payload> {
  // TODO: integrate @fhevm/sdk here.
  // Placeholder returns a mock structure compatible with the ABI tuple.
  const mock = { data: new Uint8Array([value & 0xff]) }
  const proof = new Uint8Array([1, 2, 3])
  return { externalEuint32: mock, proof }
}
