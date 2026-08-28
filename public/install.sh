#!/bin/sh
set -eu
repo="B-Divyesh/sf-freelancer-agent-context"
release="https://api.github.com/repos/$repo/releases/latest"
os="$(uname -s)"
case "$os" in
  Darwin) pattern='.dmg' ;;
  Linux) pattern='amd64.AppImage' ;;
  *) echo "Use the Windows installer from the release page." >&2; exit 1 ;;
esac
json="$(curl -fsSL "$release")"
url="$(printf '%s' "$json" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*\)".*/\1/p' | grep "$pattern" | head -1)"
[ -n "$url" ] || { echo "A matching download is not published yet." >&2; exit 1; }
file="${TMPDIR:-/tmp}/client-context-firewall-${pattern##*.}"
curl -fL "$url" -o "$file"
sum_url="$(printf '%s' "$json" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*SHA256SUMS\)".*/\1/p' | head -1)"
[ -n "$sum_url" ] || { echo "Release checksums are missing." >&2; exit 1; }
expected="$(curl -fsSL "$sum_url" | grep "$(basename "$url")" | awk '{print $1}')"
if command -v sha256sum >/dev/null 2>&1; then actual="$(sha256sum "$file" | awk '{print $1}')"; else actual="$(shasum -a 256 "$file" | awk '{print $1}')"; fi
[ "$actual" = "$expected" ] || { echo "Checksum failed. The download was not opened." >&2; exit 1; }
echo "Downloaded and verified the release at $file"
echo "Open it to install Client Context Firewall. Release checksums are published beside it."
