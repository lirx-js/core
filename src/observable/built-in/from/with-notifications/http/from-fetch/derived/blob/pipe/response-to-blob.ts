export function responseToBlob(
  response: Response,
): Promise<Blob> {
  return response.blob();
}

