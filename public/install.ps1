$ErrorActionPreference = "Stop"
$release = Invoke-RestMethod "https://api.github.com/repos/B-Divyesh/sf-freelancer-agent-context/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.msi$' } | Select-Object -First 1
if (-not $asset) { throw "The Windows installer is not published yet." }
$file = Join-Path $env:TEMP "Client-Context-Firewall.msi"
Invoke-WebRequest $asset.browser_download_url -OutFile $file
Write-Host "Downloaded the release installer to $file"
Start-Process msiexec.exe -Wait -ArgumentList "/i `"$file`""
