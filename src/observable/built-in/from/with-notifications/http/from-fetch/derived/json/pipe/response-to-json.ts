export function responseToJSON<GData>(response: Response): Promise<GData> {
  return response.json();
}
