export type NativeLaunchReceipt = {
  profileDir: string;
  contextPath: string;
  confirmed: boolean;
};

/** A native process spawn is not provenance. Only an explicit profile-side
 * startup acknowledgement may be written into a delivery record. */
export function isConfirmedNativeLaunch(receipt: NativeLaunchReceipt): boolean {
  return receipt.confirmed === true && receipt.profileDir.length > 0 && receipt.contextPath.length > 0;
}
