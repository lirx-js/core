export function responseToText(response: Response): Promise<string> {
  return response.text();
}
