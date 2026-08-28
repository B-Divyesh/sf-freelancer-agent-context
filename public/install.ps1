$ErrorActionPreference = "Stop"
$release = Invoke-RestMethod "https://api.github.com/repos/B-Divyesh/sf-freelancer-agent-context/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.msi$' } | Select-Object -First 1
if (-not $asset) { throw "The Windows installer is not published yet." }
$file = Join-Path $env:TEMP "Client-Context-Firewall.msi"
Invoke-WebRequest $asset.browser_download_url -OutFile $file
$sums = $release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
if (-not $sums) { throw "Release checksums are missing." }
$sumsFile = Join-Path $env:TEMP "Client-Context-Firewall-SHA256SUMS"
Invoke-WebRequest $sums.browser_download_url -OutFile $sumsFile
$expected = ((Get-Content $sumsFile | Where-Object { $_ -match [regex]::Escape($asset.name) }) -split '\s+')[0]
$actual = (Get-FileHash $file -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $expected.ToLower()) { throw "Checksum failed. The installer was not opened." }
Write-Host "Downloaded and verified the release installer at $file"
Start-Process msiexec.exe -Wait -ArgumentList "/i `"$file`""
