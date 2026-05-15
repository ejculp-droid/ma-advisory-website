# Image optimization script for rtoadvisory.com
# Reads source PNGs from assets/images, converts to WebP into assets/images-optimized/
# Renames to clean kebab-case, resizes per target intent.

$ErrorActionPreference = 'Stop'
$root = 'C:\Users\ejcul\OneDrive - RTO Advisory\Update RTO Site Collateral'
$srcRoot = Join-Path $root 'assets\images'
$outRoot = Join-Path $root 'assets\images-optimized'

# Ensure output directories exist
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'home') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'about') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'why-rto') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'fee-structure') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'value-optimization') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'succession-planning') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'transaction-advisory') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'logo') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'white-paper') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outRoot 'shared') | Out-Null

# Manifest: src (relative to assets/images) | out (relative to assets/images-optimized) | maxWidth | quality | role
# role: hero=1920w q82, section=1400w q80, card=800w q78, thumb=480w q78, logo=keep alpha, icon=keep
$manifest = @(
    # ============ LOGO / ICONS (keep PNG OR PNG+WebP, preserve alpha) ============
    @{src='RTO_LOGO_CLEANED_UP.png'; out='logo\rto-logo.webp'; w=512; q=90; role='logo'},
    @{src='RTO_LOGO_email.png';      out='logo\rto-logo-email.webp'; w=512; q=90; role='logo'},
    @{src='favicon.png';             out='shared\favicon.png';        w=180; q=0;  role='passthrough-png'},

    # ============ HOME ============
    @{src='Home\index_hero.png';     out='home\home-hero.webp';       w=1920; q=82; role='hero'},

    # ============ ABOUT ============
    @{src='About\About_Hero.png';    out='about\about-hero.webp';     w=1920; q=82; role='hero'},
    @{src='About\RS B&W.png';        out='about\elliott-portrait.webp'; w=900; q=82; role='portrait'},

    # ============ WHY RTO ============
    @{src='Why-RTO-TOP RIGHT.png';   out='why-rto\why-rto-hero.webp'; w=1400; q=82; role='section'},
    @{src='WHY-RTO_Wondering.png';   out='why-rto\why-rto-wondering.webp'; w=1200; q=80; role='section'},
    @{src='WHY-RTO_Challenges.png';  out='why-rto\why-rto-challenges.webp'; w=1200; q=80; role='section'},

    # ============ FEE STRUCTURE ============
    @{src='Feebased_topright.png';   out='fee-structure\fees-hero.webp';     w=1400; q=82; role='section'},
    @{src='Feebased_Project.png';    out='fee-structure\fees-project.webp';  w=1200; q=80; role='section'},
    @{src='Feebased_Retainer.png';   out='fee-structure\fees-retainer.webp'; w=1200; q=80; role='section'},

    # ============ SHARED MEN (used across pages) ============
    @{src='LMAN.png'; out='shared\figure-left.webp';  w=900; q=80; role='card'},
    @{src='RMAN.png'; out='shared\figure-right.webp'; w=900; q=80; role='card'},

    # ============ VALUE OPTIMIZATION ============
    @{src='Value-Opt_top eight hero.png';                                out='value-optimization\value-opt-hero.webp'; w=1920; q=82; role='hero'},
    @{src='Value-Opt_section 1_STRATEGIC VALUE OPTIMIZATION.png';        out='value-optimization\value-opt-section-1.webp'; w=1200; q=80; role='section'},
    @{src='Value-Opt_section 2_THE VALUE CREATION OPPORTUNITY.png';      out='value-optimization\value-opt-section-2.webp'; w=1200; q=80; role='section'},
    @{src='Value-Opt_section 3_The RTO Value Optimization Framework.png';out='value-optimization\value-opt-section-3.webp'; w=1200; q=80; role='section'},

    # ============ SUCCESSION PLANNING ============
    @{src='Succession Planning\Succession Planning_Hero.png';                                                          out='succession-planning\succession-hero.webp'; w=1920; q=82; role='hero'},
    @{src='Succession Planning\Our Succession Philosophy.png';                                                         out='succession-planning\succession-philosophy.webp'; w=1200; q=80; role='section'},
    @{src='Succession Planning\Succession Planning_Why It Matters.png';                                                out='succession-planning\succession-why-it-matters.webp'; w=1200; q=80; role='section'},
    @{src='Succession Planning\Succession Planning_Contingency & Emergency Planning.png';                              out='succession-planning\succession-contingency.webp'; w=1200; q=80; role='section'},
    @{src='Succession Planning\Succession Planning_Executive Development & Knowledge Transfer.png';                    out='succession-planning\succession-executive-development.webp'; w=1200; q=80; role='section'},
    @{src='Succession Planning\Succession Planning_Succession Planning Services_Family Business Succession.png';       out='succession-planning\succession-family-business.webp'; w=1200; q=80; role='section'},
    @{src='Succession Planning\Succession Planning_Succession Planning Services_Management Transition & Buyouts.png';  out='succession-planning\succession-management-transition.webp'; w=1200; q=80; role='section'},

    # ============ TRANSACTION ADVISORY ============
    @{src='transaction-advisory\transaction-advisory_hero.png';                          out='transaction-advisory\transaction-hero.webp'; w=1920; q=82; role='hero'},
    @{src='transaction-advisory\transaction-advisory_Our Transaction Philosophy.png';    out='transaction-advisory\transaction-philosophy.webp'; w=1200; q=80; role='section'},
    @{src='transaction-advisory\transaction-advisory_When-to-Engage_Buyer-in-Mind.png';      out='transaction-advisory\transaction-buyer-in-mind.webp'; w=900; q=80; role='card'},
    @{src='transaction-advisory\transaction-advisory_When-to-Engage_Preparing-to-Transact.png'; out='transaction-advisory\transaction-preparing-to-transact.webp'; w=900; q=80; role='card'},
    @{src='transaction-advisory\transaction-advisory_When-to-Engage_Received-Offer.png';  out='transaction-advisory\transaction-received-offer.webp'; w=900; q=80; role='card'},

    # ============ WHITE PAPER ============
    @{src='WHITE PAPER THUMB NAIL.png'; out='white-paper\exit-readiness-gap-cover.webp'; w=900; q=82; role='card'}
)

$results = @()
$totalSrc = 0
$totalOut = 0

foreach ($item in $manifest) {
    $srcPath = Join-Path $srcRoot $item.src
    $outPath = Join-Path $outRoot $item.out

    if (-not (Test-Path -LiteralPath $srcPath)) {
        Write-Host "MISSING: $($item.src)" -ForegroundColor Red
        $results += [pscustomobject]@{Status='MISSING'; Src=$item.src; Out=$item.out; SrcKB=0; OutKB=0; Dims=''}
        continue
    }

    $srcSize = (Get-Item -LiteralPath $srcPath).Length
    $totalSrc += $srcSize

    $maxW = $item.w
    $q = $item.q

    if ($item.role -eq 'passthrough-png') {
        # Just copy + resize PNG (favicon)
        & magick "$srcPath" -resize "${maxW}x>" -strip "$outPath" 2>$null
    }
    elseif ($item.role -eq 'logo') {
        # Preserve alpha, lossless-ish WebP
        & magick "$srcPath" -resize "${maxW}x>" -strip -define webp:lossless=false -quality $q "$outPath" 2>$null
    }
    else {
        # Photographic: resize + strip + WebP
        & magick "$srcPath" -resize "${maxW}x>" -strip -interlace Plane -sampling-factor 4:2:0 -quality $q "$outPath" 2>$null
    }

    if (Test-Path -LiteralPath $outPath) {
        $outSize = (Get-Item -LiteralPath $outPath).Length
        $totalOut += $outSize
        $dims = & magick identify -format "%wx%h" "$outPath" 2>$null
        $srcKB = [math]::Round($srcSize/1KB, 0)
        $outKB = [math]::Round($outSize/1KB, 0)
        $pct = [math]::Round(100 * (1 - $outSize/$srcSize), 0)
        Write-Host ("OK  {0,5}KB -> {1,5}KB ({2,3}%)  {3} -> {4}  [{5}]" -f $srcKB, $outKB, $pct, $item.src, $item.out, $dims)
        $results += [pscustomobject]@{Status='OK'; Src=$item.src; Out=$item.out; SrcKB=$srcKB; OutKB=$outKB; Dims=$dims}
    }
    else {
        Write-Host "FAILED to write: $($item.out)" -ForegroundColor Red
        $results += [pscustomobject]@{Status='FAILED'; Src=$item.src; Out=$item.out; SrcKB=[math]::Round($srcSize/1KB,0); OutKB=0; Dims=''}
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host ("TOTAL SRC: {0:N1} MB" -f ($totalSrc/1MB))
Write-Host ("TOTAL OUT: {0:N1} MB" -f ($totalOut/1MB))
if ($totalSrc -gt 0) {
    Write-Host ("REDUCTION: {0:N0}%" -f (100 * (1 - $totalOut/$totalSrc)))
}
Write-Host "=========================================="

# Save manifest CSV for reference
$results | Export-Csv -Path (Join-Path $outRoot '_manifest.csv') -NoTypeInformation
Write-Host "Manifest written: $(Join-Path $outRoot '_manifest.csv')"
