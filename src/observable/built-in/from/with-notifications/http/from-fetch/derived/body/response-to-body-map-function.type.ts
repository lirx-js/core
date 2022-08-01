export interface IResponseToBodyMapFunction<GData> {
  (
    response: Response,
  ): Promise<GData>;
}
