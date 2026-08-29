#!/bin/sh
set -eu
repo="B-Divyesh/sf-freelancer-agent-context"
release="https://api.github.com/repos/$repo/releases/latest"
os="$(uname -s)"
case "$os" in
  Darwin)
    case "$(uname -m)" in
      arm64|aarch64) pattern='_aarch64.dmg' ;;
      x86_64) pattern='_x64.dmg' ;;
      *) echo "This Mac architecture does not have a published build." >&2; exit 1 ;;
    esac
    ;;
  Linux) pattern='amd64.AppImage' ;;
  *) echo "Use the Windows installer from the release page." >&2; exit 1 ;;
esac
json="$(curl -fsSL "$release")"
url="$(printf '%s' "$json" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*\)".*/\1/p' | grep "$pattern" | head -1)"
[ -n "$url" ] || { echo "A matching download is not published yet." >&2; exit 1; }
file="${TMPDIR:-/tmp}/client-context-firewall-download"
curl -fL "$url" -o "$file"
sum_url="$(printf '%s' "$json" | tr ',' '\n' | sed -n 's/.*"browser_download_url": *"\([^"]*SHA256SUMS\)".*/\1/p' | head -1)"
[ -n "$sum_url" ] || { echo "Release checksums are missing." >&2; exit 1; }
expected="$(curl -fsSL "$sum_url" | grep "$(basename "$url")" | awk '{print $1}')"
if command -v sha256sum >/dev/null 2>&1; then actual="$(sha256sum "$file" | awk '{print $1}')"; else actual="$(shasum -a 256 "$file" | awk '{print $1}')"; fi
[ "$actual" = "$expected" ] || { echo "Checksum failed. The download was not installed." >&2; exit 1; }
if [ "$os" = "Linux" ]; then
  install_dir="${XDG_BIN_HOME:-${HOME}/.local/bin}"
  install_path="$install_dir/client-context-firewall"
  mkdir -p "$install_dir"
  install -m 755 "$file" "$install_path"
  rm -f "$file"
  echo "Installed and verified Client Context Firewall at $install_path"
  case ":${PATH}:" in
    *:"$install_dir":*) echo "Run client-context-firewall to open it." ;;
    *) echo "Add $install_dir to PATH, then run client-context-firewall." ;;
  esac
else
  echo "Downloaded and verified the macOS installer at $file"
  open "$file"
  echo "Opened the correct installer for $(uname -m)."
fi
