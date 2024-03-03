export function responseToArrayBuffer(response: Response): Promise<ArrayBuffer> {
  return response.arrayBuffer();
}
