# Round 3: missed exit-readiness page images
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\ejcul\OneDrive - RTO Advisory\Update RTO Site Collateral'
$srcRoot = Join-Path $root 'assets\images'
$outRoot = Join-Path $root 'assets\images-optimized'
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$utf8Bom   = New-Object System.Text.UTF8Encoding $true

New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'exit-readiness') | Out-Null

# Map: source filename -> output filename + dimensions
$tasks = @(
    # === 6 stat cards (mr-01..mr-06) ===
    @{src='1. 75_58.png';  out='exit-readiness\stat-1.webp'; w=1200; q=80},
    @{src='2. 20_40.png';  out='exit-readiness\stat-2.webp'; w=1200; q=80},
    @{src='3. 20_30.png';  out='exit-readiness\stat-3.webp'; w=1200; q=80},
    @{src='4. 75_70.png';  out='exit-readiness\stat-4.webp'; w=1200; q=80},
    @{src='5. 14T.png';    out='exit-readiness\stat-5.webp'; w=1200; q=80},
    @{src='6. 18_24.png';  out='exit-readiness\stat-6.webp'; w=1200; q=80},
    # === 2 owner cards ===
    @{src='exit-readiness_Owner A.png'; out='exit-readiness\owner-a.webp'; w=1200; q=82},
    @{src='exit-readiness_Owner B.png'; out='exit-readiness\owner-b.webp'; w=1200; q=82},
    # === 6 discipline domain cards (wp-01..wp-06) ===
    @{src='EXRED-Banking, Coverage & Collateral.png'; out='exit-readiness\discipline-banking.webp';                w=1200; q=80},
    @{src='EXRED-Financial Reporting.png';            out='exit-readiness\discipline-financial-reporting.webp';    w=1200; q=80},
    @{src='EXRED-Operational Dependence.png';         out='exit-readiness\discipline-operational-dependence.webp'; w=1200; q=80},
    @{src='EXRED-Succession & Continuity.png';        out='exit-readiness\discipline-succession-continuity.webp';  w=1200; q=80},
    @{src='EXRED-Tax Strategy.png';                   out='exit-readiness\discipline-tax-strategy.webp';           w=1200; q=80},
    @{src='EXRED-Valuation Reality.png';              out='exit-readiness\discipline-valuation-reality.webp';      w=1200; q=80}
)

Write-Host "=== ROUND 3: exit-readiness images ==="
$totalSrc=0; $totalOut=0
foreach ($t in $tasks) {
    $sp = Join-Path $srcRoot $t.src; $op = Join-Path $outRoot $t.out
    if (-not (Test-Path -LiteralPath $sp)) { Write-Host "MISS $($t.src)" -F Red; continue }
    $ss = (Get-Item -LiteralPath $sp).Length; $totalSrc += $ss
    & magick "$sp" -resize "$($t.w)x>" -strip -interlace Plane -sampling-factor 4:2:0 -quality $t.q "$op" 2>$null
    if (Test-Path -LiteralPath $op) {
        $os = (Get-Item -LiteralPath $op).Length; $totalOut += $os
        $d = & magick identify -format "%wx%h" "$op" 2>$null
        Write-Host ("OK {0,5}KB -> {1,5}KB ({2,3}%) [{3}] {4}" -f [math]::Round($ss/1KB,0), [math]::Round($os/1KB,0), [math]::Round(100*(1-$os/$ss),0), $d, (Split-Path $t.out -Leaf))
    } else { Write-Host "FAILED $op" -F Red }
}
Write-Host ("Round 3 totals: {0:N1} MB -> {1:N1} MB" -f ($totalSrc/1MB), ($totalOut/1MB))
Write-Host ""

# === Now wire them into exit-readiness.html ===
$swaps = [ordered]@{
    'assets/images/EXRED-Banking, Coverage & Collateral.png' = 'assets/images-optimized/exit-readiness/discipline-banking.webp'
    'assets/images/EXRED-Financial Reporting.png'            = 'assets/images-optimized/exit-readiness/discipline-financial-reporting.webp'
    'assets/images/EXRED-Operational Dependence.png'         = 'assets/images-optimized/exit-readiness/discipline-operational-dependence.webp'
    'assets/images/EXRED-Succession & Continuity.png'        = 'assets/images-optimized/exit-readiness/discipline-succession-continuity.webp'
    'assets/images/EXRED-Tax Strategy.png'                   = 'assets/images-optimized/exit-readiness/discipline-tax-strategy.webp'
    'assets/images/EXRED-Valuation Reality.png'              = 'assets/images-optimized/exit-readiness/discipline-valuation-reality.webp'
    'assets/images/exit-readiness_Owner A.png'               = 'assets/images-optimized/exit-readiness/owner-a.webp'
    'assets/images/exit-readiness_Owner B.png'               = 'assets/images-optimized/exit-readiness/owner-b.webp'
    'assets/images/1. 75_58.png' = 'assets/images-optimized/exit-readiness/stat-1.webp'
    'assets/images/2. 20_40.png' = 'assets/images-optimized/exit-readiness/stat-2.webp'
    'assets/images/3. 20_30.png' = 'assets/images-optimized/exit-readiness/stat-3.webp'
    'assets/images/4. 75_70.png' = 'assets/images-optimized/exit-readiness/stat-4.webp'
    'assets/images/5. 14T.png'   = 'assets/images-optimized/exit-readiness/stat-5.webp'
    'assets/images/6. 18_24.png' = 'assets/images-optimized/exit-readiness/stat-6.webp'
}

$target = "$root\pages\services\exit-readiness.html"
$bytes = [System.IO.File]::ReadAllBytes($target)
$hadBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
$enc = if ($hadBom) { $utf8Bom } else { $utf8NoBom }
$txt = [System.IO.File]::ReadAllText($target, $enc)
$preDash = ([regex]::Matches($txt, [char]0x2014)).Count
$preLen  = $bytes.Length

Write-Host "=== WIRING exit-readiness.html ==="
Write-Host "Pre: BOM=$hadBom em-dashes=$preDash bytes=$preLen"
$applied = 0
foreach ($k in $swaps.Keys) {
    $cnt = ([regex]::Matches($txt, [regex]::Escape($k))).Count
    if ($cnt -gt 0) { $txt = $txt.Replace($k, $swaps[$k]); $applied += $cnt; Write-Host ("  {0,2} swap(s)  {1}" -f $cnt, $k) }
}
[System.IO.File]::WriteAllText($target, $txt, $enc)

# Verify
$bytes2 = [System.IO.File]::ReadAllBytes($target)
$hasBom2 = $bytes2.Length -ge 3 -and $bytes2[0] -eq 0xEF -and $bytes2[1] -eq 0xBB -and $bytes2[2] -eq 0xBF
$txt2 = [System.IO.File]::ReadAllText($target, $enc)
$postDash = ([regex]::Matches($txt2, [char]0x2014)).Count
$stale = [regex]::Matches($txt2, '(?i)assets/images/(?!optimized)[^"''\s)<>]*?\.(?:png|jpe?g|gif)')

Write-Host "Post: BOM=$hasBom2 em-dashes=$postDash bytes=$($bytes2.Length)"
Write-Host "Total swaps applied: $applied"
if ($hasBom2 -ne $hadBom)        { Write-Host "FAIL: BOM state changed" -F Red; exit 1 }
if ($postDash -ne $preDash)      { Write-Host "FAIL: em-dash count changed" -F Red; exit 1 }
if ($stale.Count -gt 0) {
    Write-Host "WARNING: $($stale.Count) remaining stale image refs:" -F Yellow
    $stale | ForEach-Object { Write-Host "  $($_.Value)" -F Yellow }
} else {
    Write-Host "ALL CLEAN - no stale image refs left in exit-readiness.html" -F Green
}
