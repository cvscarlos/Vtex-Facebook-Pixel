/* eslint-disable no-unused-vars */

declare function fbq(...args: unknown[]): void;

declare const cvsAppSettings: Record<string, string>;

declare interface Window {
  cvsAppSettings: Record<string, string>;
}
