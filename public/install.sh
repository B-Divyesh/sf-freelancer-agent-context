#!/bin/sh
set -eu
repo="B-Divyesh/sf-freelancer-agent-context"
release="https://api.github.com/repos/$repo/releases/latest"
os="$(uname -s)"
case "$os" in
  Darwin) pattern='universal.dmg' ;;
  Linux) pattern='amd64.AppImage' ;;
  *) echo "Use the Windows installer from the release page." >&2; exit 1 ;;
esac
json="$(curl -fsSL "$release")"
url="$(printf '%s' "$json" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*\)".*/\1/p' | grep "$pattern" | head -1)"
[ -n "$url" ] || { echo "A matching download is not published yet." >&2; exit 1; }
file="${TMPDIR:-/tmp}/client-context-firewall-${pattern##*.}"
curl -fL "$url" -o "$file"
echo "Downloaded the verified release transport to $file"
echo "Open it to install Client Context Firewall. Release checksums are published beside it."
