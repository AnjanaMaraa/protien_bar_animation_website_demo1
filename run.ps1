# run.ps1 - One-shot launcher for the DigiMaraa Nutrition frontend (Vite + React + TS)
# Usage:
#   .\run.ps1                 # install if needed, then start dev server
#   .\run.ps1 -Mode build     # production build
#   .\run.ps1 -Mode preview   # build + preview production locally
#   .\run.ps1 -SkipInstall    # skip the dependency install check
#   .\run.ps1 -NoEnv          # do not create .env.local from .env.example

[CmdletBinding()]
param(
    [ValidateSet('dev', 'build', 'preview')]
    [string]$Mode = 'dev',
    [switch]$SkipInstall,
    [switch]$NoEnv
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -LiteralPath $projectRoot

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Err($msg)  { Write-Host "ERROR: $msg" -ForegroundColor Red }

# 1. Verify Node.js / npm are available
Write-Step 'Checking prerequisites (Node.js / npm)'
try {
    $nodeVersion = (& node --version) 2>$null
    $npmVersion  = (& npm --version) 2>$null
} catch {
    Write-Err 'Node.js and/or npm were not found on PATH. Install Node.js 18+ from https://nodejs.org and retry.'
    exit 1
}
Write-Host "    Node $nodeVersion / npm $npmVersion"

# 2. Install dependencies when node_modules is missing
if (-not $SkipInstall) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules'))) {
        Write-Step 'node_modules not found - installing dependencies (npm install)'
        & npm install
        if ($LASTEXITCODE -ne 0) { Write-Err 'npm install failed.'; exit $LASTEXITCODE }
    } else {
        Write-Step 'Dependencies already installed - skipping (use -SkipInstall to always skip)'
    }
}

# 3. Create .env.local from .env.example if it does not exist
$envLocal    = Join-Path $projectRoot '.env.local'
$envExample  = Join-Path $projectRoot '.env.example'
if (-not $NoEnv -and -not (Test-Path -LiteralPath $envLocal) -and (Test-Path -LiteralPath $envExample)) {
    Write-Step 'Creating .env.local from .env.example'
    Copy-Item -LiteralPath $envExample -Destination $envLocal
    Write-Host '    A .env.local was created. Add your GEMINI_API_KEY before using AI features.' -ForegroundColor Yellow
}

# 4. Run the requested task
switch ($Mode) {
    'dev' {
        Write-Step 'Starting frontend dev server (http://localhost:3000) - press Ctrl+C to stop'
        & npm run dev
    }
    'build' {
        Write-Step 'Building production bundle'
        & npm run build
    }
    'preview' {
        Write-Step 'Building production bundle'
        & npm run build
        if ($LASTEXITCODE -ne 0) { Write-Err 'Build failed.'; exit $LASTEXITCODE }
        Write-Step 'Starting preview server'
        & npm run preview
    }
}

exit $LASTEXITCODE