# Round 2: additions, replacements, and logo pack extraction
$ErrorActionPreference = 'Stop'
$root = 'C:\Users\ejcul\OneDrive - RTO Advisory\Update RTO Site Collateral'
$srcRoot = Join-Path $root 'assets\images'
$outRoot = Join-Path $root 'assets\images-optimized'
$b4aft = 'C:\Users\ejcul\OneDrive\Desktop\B4AFT'
$logoZip = 'C:\Users\ejcul\Downloads\RTO_LOGO_PACK.zip'

# Convert/process tasks
$tasks = @(
    # Fee-structure: LMAN/RMAN renamed for clear context
    @{src=(Join-Path $srcRoot 'LMAN.png'); out=(Join-Path $outRoot 'fee-structure\fees-commission-broker.webp'); w=900; q=82; role='card'},
    @{src=(Join-Path $srcRoot 'RMAN.png'); out=(Join-Path $outRoot 'fee-structure\fees-fee-based-advisor.webp'); w=900; q=82; role='card'},

    # Home: services blocks
    @{src=(Join-Path $srcRoot 'Home\HOME PAGE BLOCKS.png'); out=(Join-Path $outRoot 'home\home-services-blocks.webp'); w=1400; q=82; role='section'},

    # Succession: replacement philosophy image (overwrite)
    @{src=(Join-Path $b4aft 'Succession_Philosophy.png'); out=(Join-Path $outRoot 'succession-planning\succession-philosophy.webp'); w=1200; q=82; role='section'},

    # Transaction Advisory: replacement philosophy image (overwrite)
    @{src=(Join-Path $b4aft 'Transaction Philosophy.png'); out=(Join-Path $outRoot 'transaction-advisory\transaction-philosophy.webp'); w=1200; q=82; role='section'},

    # Transaction Advisory: missing additions
    @{src=(Join-Path $srcRoot 'transaction-advisory\transaction-advisory_The difference between a transaction.png'); out=(Join-Path $outRoot 'transaction-advisory\transaction-difference.webp'); w=1200; q=82; role='section'},
    @{src=(Join-Path $srcRoot 'transaction-advisory\transaction-advisory_Six Disciplines.png'); out=(Join-Path $outRoot 'transaction-advisory\transaction-six-disciplines.webp'); w=1200; q=82; role='section'}
)

Write-Host "=== ROUND 2: additions / replacements ==="
$totalSrc = 0; $totalOut = 0
foreach ($t in $tasks) {
    if (-not (Test-Path -LiteralPath $t.src)) { Write-Host "MISSING $($t.src)" -F Red; continue }
    $srcSize = (Get-Item -LiteralPath $t.src).Length; $totalSrc += $srcSize
    & magick "$($t.src)" -resize "$($t.w)x>" -strip -interlace Plane -sampling-factor 4:2:0 -quality $t.q "$($t.out)" 2>$null
    if (Test-Path -LiteralPath $t.out) {
        $outSize = (Get-Item -LiteralPath $t.out).Length; $totalOut += $outSize
        $dims = & magick identify -format "%wx%h" "$($t.out)" 2>$null
        $sKB=[math]::Round($srcSize/1KB,0); $oKB=[math]::Round($outSize/1KB,0); $pct=[math]::Round(100*(1-$outSize/$srcSize),0)
        Write-Host ("OK {0,5}KB -> {1,5}KB ({2,3}%) [{3}] {4}" -f $sKB,$oKB,$pct,$dims,(Split-Path $t.out -Leaf))
    } else { Write-Host "FAILED $($t.out)" -F Red }
}
Write-Host ("Round 2 totals: {0:N1} MB -> {1:N1} MB" -f ($totalSrc/1MB), ($totalOut/1MB))

# === Logo pack extraction ===
Write-Host ""
Write-Host "=== LOGO PACK ==="
Add-Type -AssemblyName System.IO.Compression.FileSystem
$logoOut = Join-Path $outRoot 'logo'
$z = [System.IO.Compression.ZipFile]::OpenRead($logoZip)
$wantedLogo = @(
    @{entry='RTO_LOGO_transparent.svg'; out='rto-logo.svg'},          # primary header logo (vector)
    @{entry='RTO_LOGO_white.svg';       out='rto-logo-white.svg'},    # for dark backgrounds (footer/CTA bands)
    @{entry='RTO_LOGO_navy.svg';        out='rto-logo-navy.svg'},     # solid brand-color version
    @{entry='RTO_MARK.svg';             out='rto-mark.svg'},          # icon-only mark (vector)
    @{entry='RTO_LOGO_transparent_512.png'; out='rto-logo-512.png'},  # raster fallback for email/social
    @{entry='RTO_LOGO_transparent_1024.png';out='rto-logo-1024.png'}, # OG image / og:image
    @{entry='RTO_MARK_256.png';         out='rto-mark-256.png'}       # apple-touch-icon size
)
foreach ($w in $wantedLogo) {
    $entry = $z.Entries | Where-Object { $_.FullName -eq $w.entry }
    if ($entry) {
        $dest = Join-Path $logoOut $w.out
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
        $kb = [math]::Round((Get-Item -LiteralPath $dest).Length/1KB,1)
        Write-Host ("OK  {0,5}KB  {1} -> logo\{2}" -f $kb, $w.entry, $w.out)
    } else { Write-Host "MISSING in zip: $($w.entry)" -F Red }
}
$z.Dispose()

# Also extract favicon set into shared/
$faviconOut = Join-Path $outRoot 'shared'
$z = [System.IO.Compression.ZipFile]::OpenRead($logoZip)
$wantedFav = @('favicon.ico','favicon-mark.ico','favicon_16.png','favicon_32.png','favicon_48.png','favicon_64.png')
foreach ($f in $wantedFav) {
    $e = $z.Entries | Where-Object { $_.FullName -eq $f }
    if ($e) {
        $dest = Join-Path $faviconOut ($f -replace '_','-')
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($e, $dest, $true)
        $kb = [math]::Round((Get-Item -LiteralPath $dest).Length/1KB,1)
        Write-Host ("OK  {0,5}KB  {1} -> shared\{2}" -f $kb, $f, ($f -replace '_','-'))
    }
}
$z.Dispose()

Write-Host ""
Write-Host "=== FINAL OPTIMIZED FOLDER SIZE ==="
$total = (Get-ChildItem -Path $outRoot -Recurse -File | Measure-Object -Property Length -Sum).Sum
Write-Host ("Total: {0:N2} MB" -f ($total/1MB))
