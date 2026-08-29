export type ReleaseAsset = { name: string; browser_download_url: string };

export type Platform = 'macOS' | 'Windows' | 'Linux';

export function detectPlatform(userAgent: string): Platform {
  if (/Mac/i.test(userAgent)) return 'macOS';
  if (/Win/i.test(userAgent)) return 'Windows';
  return 'Linux';
}

export function detectMacArchitecture(userAgent: string): 'arm64' | 'x64' | null {
  if (/arm64|aarch64/i.test(userAgent)) return 'arm64';
  if (/Intel|x86_64|x64/i.test(userAgent)) return 'x64';
  return null;
}

export function platformAssets(
  assets: ReleaseAsset[],
  platform: Platform,
  userAgent: string
): ReleaseAsset[] {
  if (platform === 'Windows') {
    return assets.filter(asset => asset.name.endsWith('.msi') || asset.name.endsWith('.exe'))
      .sort((left, right) => Number(right.name.endsWith('.msi')) - Number(left.name.endsWith('.msi')));
  }
  if (platform === 'Linux') {
    return assets.filter(asset => asset.name.endsWith('.AppImage') || asset.name.endsWith('.deb'))
      .sort((left, right) => Number(right.name.endsWith('.AppImage')) - Number(left.name.endsWith('.AppImage')));
  }

  const mac = assets.filter(asset => asset.name.endsWith('.dmg'));
  const architecture = detectMacArchitecture(userAgent);
  if (!architecture) return mac;
  const matcher = architecture === 'arm64' ? /aarch64|arm64/i : /x64|x86_64/i;
  return [...mac].sort((left, right) => Number(matcher.test(right.name)) - Number(matcher.test(left.name)));
}
