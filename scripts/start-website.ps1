$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$nodeDirectory = Join-Path $projectRoot ".runtime\node-v22.14.0-win-x64"
$npmCommand = Join-Path $nodeDirectory "npm.cmd"
$devCommand = Join-Path $projectRoot "node_modules\.bin\vinext.cmd"
$siteUrl = "http://127.0.0.1:3000/?v=version1"

try {
  $existingSite = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2
  if ($existingSite.StatusCode -eq 200) {
    Start-Process $siteUrl
    Write-Host "Alina Portfolio Version 1 is already running."
    exit 0
  }
} catch {
  # No existing preview is running; continue with normal startup.
}

if (-not (Test-Path -LiteralPath $npmCommand)) {
  Write-Host "The portable website runtime is missing."
  Write-Host "Please ask Codex to restore the local runtime for Version 1."
  exit 1
}

$env:Path = "$nodeDirectory;$env:Path"
$env:npm_config_cache = Join-Path $projectRoot ".npm-cache"
$env:WRANGLER_LOG_PATH = Join-Path $projectRoot ".wrangler\wrangler.log"

if (-not (Test-Path -LiteralPath $devCommand)) {
  Write-Host "Preparing the website for first use..."
  & $npmCommand ci --ignore-scripts --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$openBrowser = "Start-Sleep -Seconds 3; Start-Process '$siteUrl'"
Start-Process powershell.exe `
  -ArgumentList @("-NoProfile", "-WindowStyle", "Hidden", "-Command", $openBrowser) `
  -WindowStyle Hidden

Write-Host ""
Write-Host "ALINA PORTFOLIO - VERSION 1"
Write-Host "The browser will open automatically."
Write-Host "Keep this window open while viewing the site."
Write-Host "Press Ctrl+C when you are finished."
Write-Host ""

& $devCommand dev --hostname 127.0.0.1 --port 3000
