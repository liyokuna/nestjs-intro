
export class messageFromatter {
  public format(message: string): string {
    return ` ${new Date().toISOString()} ${message}`;
  }
}
