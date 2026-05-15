# Wire optimized images into HTML.
# Pure URL substitution. No structural HTML edits.
# Pre-flight verifies UTF-8 no BOM. Post-flight verifies em-dash counts unchanged + no live broken refs.

$ErrorActionPreference = 'Stop'
$root = 'C:\Users\ejcul\OneDrive - RTO Advisory\Update RTO Site Collateral'
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$utf8Bom   = New-Object System.Text.UTF8Encoding $true

function Get-EncodingForFile($path) {
    $b = [System.IO.File]::ReadAllBytes($path)
    if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) { return $utf8Bom } else { return $utf8NoBom }
}

# ============= REPLACEMENT TABLE =============
# Order matters: longest/most-specific first to avoid partial matches.
# All keys + values match raw text in HTML (URL-encoded variants included).
$swaps = [ordered]@{
    # === Schema/og:image full URLs (must come before bare path forms) ===
    'https://rtoadvisory.com/assets/images/RTO_LOGO_CLEANED_UP.png'             = 'https://rtoadvisory.com/assets/images-optimized/logo/rto-logo-1024.png'
    'https://rtoadvisory.com/assets/images/About/RS%20B%26W.png'                = 'https://rtoadvisory.com/assets/images-optimized/about/elliott-portrait.jpg'

    # === Succession Planning (longest paths first to avoid prefix collisions) ===
    'assets/images/Succession%20Planning/Succession%20Planning_Succession%20Planning%20Services_Family%20Business%20Succession.png'      = 'assets/images-optimized/succession-planning/succession-family-business.webp'
    'assets/images/Succession%20Planning/Succession%20Planning_Succession%20Planning%20Services_Management%20Transition%20%26%20Buyouts.png' = 'assets/images-optimized/succession-planning/succession-management-transition.webp'
    'assets/images/Succession%20Planning/Succession%20Planning_Contingency%20%26%20Emergency%20Planning.png'                            = 'assets/images-optimized/succession-planning/succession-contingency.webp'
    'assets/images/Succession%20Planning/Succession%20Planning_Executive%20Development%20%26%20Knowledge%20Transfer.png'                = 'assets/images-optimized/succession-planning/succession-executive-development.webp'
    'assets/images/Succession%20Planning/Succession%20Planning_Why%20It%20Matters.png'                                                  = 'assets/images-optimized/succession-planning/succession-why-it-matters.webp'
    'assets/images/Succession%20Planning/Succession%20Planning_Hero.png'                                                                = 'assets/images-optimized/succession-planning/succession-hero.webp'
    'assets/images/Succession%20Planning/Our%20Succession%20Philosophy.png'                                                             = 'assets/images-optimized/succession-planning/succession-philosophy.webp'

    # === Transaction Advisory ===
    'assets/images/transaction-advisory/transaction-advisory_When-to-Engage_Preparing-to-Transact.png' = 'assets/images-optimized/transaction-advisory/transaction-preparing-to-transact.webp'
    'assets/images/transaction-advisory/transaction-advisory_When-to-Engage_Buyer-in-Mind.png'         = 'assets/images-optimized/transaction-advisory/transaction-buyer-in-mind.webp'
    'assets/images/transaction-advisory/transaction-advisory_When-to-Engage_Received-Offer.png'        = 'assets/images-optimized/transaction-advisory/transaction-received-offer.webp'
    'assets/images/transaction-advisory/transaction-advisory_Our%20Transaction%20Philosophy.png'       = 'assets/images-optimized/transaction-advisory/transaction-philosophy.webp'
    'assets/images/transaction-advisory/transaction-advisory_hero.png'                                 = 'assets/images-optimized/transaction-advisory/transaction-hero.webp'

    # === Value Optimization ===
    'assets/images/Value-Opt_section%201_STRATEGIC%20VALUE%20OPTIMIZATION.png'         = 'assets/images-optimized/value-optimization/value-opt-section-1.webp'
    'assets/images/Value-Opt_section%202_THE%20VALUE%20CREATION%20OPPORTUNITY.png'     = 'assets/images-optimized/value-optimization/value-opt-section-2.webp'
    'assets/images/Value-Opt_section%203_The%20RTO%20Value%20Optimization%20Framework.png' = 'assets/images-optimized/value-optimization/value-opt-section-3.webp'
    'assets/images/Value-Opt_top%20eight%20hero.png'                                   = 'assets/images-optimized/value-optimization/value-opt-hero.webp'

    # === Why RTO ===
    'assets/images/WHY-RTO_Challenges.png' = 'assets/images-optimized/why-rto/why-rto-challenges.webp'
    'assets/images/WHY-RTO_Wondering.png'  = 'assets/images-optimized/why-rto/why-rto-wondering.webp'
    'assets/images/Why-RTO-TOP%20RIGHT.png'= 'assets/images-optimized/why-rto/why-rto-hero.webp'

    # === Fee Structure ===
    'assets/images/Feebased_Project.png'  = 'assets/images-optimized/fee-structure/fees-project.webp'
    'assets/images/Feebased_Retainer.png' = 'assets/images-optimized/fee-structure/fees-retainer.webp'
    'assets/images/Feebased_topright.png' = 'assets/images-optimized/fee-structure/fees-hero.webp'
    'assets/images/LMAN.png'              = 'assets/images-optimized/fee-structure/fees-commission-broker.webp'
    'assets/images/RMAN.png'              = 'assets/images-optimized/fee-structure/fees-fee-based-advisor.webp'

    # === About ===
    'assets/images/About/About_Hero.png' = 'assets/images-optimized/about/about-hero.webp'
    'assets/images/About/RS%20B%26W.png' = 'assets/images-optimized/about/elliott-portrait.webp'

    # === Home ===
    'assets/images/Home/index_hero.png' = 'assets/images-optimized/home/home-hero.webp'

    # === White paper thumbnail ===
    'assets/images/WHITE%20PAPER%20THUMB%20NAIL.png' = 'assets/images-optimized/white-paper/exit-readiness-gap-cover.webp'

    # === Favicon (last; shortest path) ===
    'assets/images/favicon.png' = 'assets/images-optimized/shared/favicon.png'
}

# ============= TARGET FILES =============
$files = Get-ChildItem -Path $root -Recurse -File -Include *.html -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\|\\netlify\\functions\\node_modules\\|\\images-optimized\\|\\Downloads\\' } |
    Where-Object { $_.Length -gt 0 }

# ============= PRE-FLIGHT CHECKS =============
Write-Host "=== PRE-FLIGHT ENCODING CHECK ==="
$preDash = @{}
$preLen = @{}
$encMap = @{}
foreach ($f in $files) {
    $enc = Get-EncodingForFile $f.FullName
    $encMap[$f.FullName] = $enc
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $hasBom = $enc -eq $utf8Bom
    $txt = [System.IO.File]::ReadAllText($f.FullName, $enc)
    $emDashCount = ([regex]::Matches($txt, [char]0x2014)).Count
    $preDash[$f.FullName] = $emDashCount
    $preLen[$f.FullName] = $bytes.Length
    $bomTag = if ($hasBom) { 'BOM' } else { 'no ' }
    $rel = $f.FullName.Substring($root.Length + 1)
    Write-Host ("  [{0}] em-dash:{1,3}  bytes:{2,7}  {3}" -f $bomTag, $emDashCount, $bytes.Length, $rel)
}

# ============= APPLY SWAPS =============
Write-Host ""
Write-Host "=== APPLYING SWAPS ==="
$totalReplacements = 0
foreach ($f in $files) {
    $rel = $f.FullName.Substring($root.Length + 1)
    $enc = $encMap[$f.FullName]
    $txt = [System.IO.File]::ReadAllText($f.FullName, $enc)
    $orig = $txt
    $fileReplacements = 0
    foreach ($k in $swaps.Keys) {
        $v = $swaps[$k]
        $count = ([regex]::Matches($txt, [regex]::Escape($k))).Count
        if ($count -gt 0) {
            $txt = $txt.Replace($k, $v)
            $fileReplacements += $count
        }
    }
    if ($txt -ne $orig) {
        [System.IO.File]::WriteAllText($f.FullName, $txt, $enc)
        Write-Host ("  {0,3} swaps  {1}" -f $fileReplacements, $rel)
        $totalReplacements += $fileReplacements
    }
}
Write-Host ""
Write-Host "Total replacements applied: $totalReplacements"

# ============= POST-FLIGHT VERIFICATION =============
Write-Host ""
Write-Host "=== POST-FLIGHT VERIFICATION ==="
$failures = 0
foreach ($f in $files) {
    $enc = $encMap[$f.FullName]
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $hasBomNow = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $hadBom = $enc -eq $utf8Bom
    $txt = [System.IO.File]::ReadAllText($f.FullName, $enc)
    $emDashCount = ([regex]::Matches($txt, [char]0x2014)).Count
    $rel = $f.FullName.Substring($root.Length + 1)
    if ($hasBomNow -ne $hadBom) { Write-Host "  FAIL BOM state changed: $rel (was BOM=$hadBom, now BOM=$hasBomNow)" -F Red; $failures++ }
    if ($emDashCount -ne $preDash[$f.FullName]) {
        Write-Host ("  FAIL em-dash count changed in {0}: was {1}, now {2}" -f $rel, $preDash[$f.FullName], $emDashCount) -F Red
        $failures++
    }
    $stale = [regex]::Matches($txt, '(?i)assets/images/(?!optimized)[^"''\s)<>]*?\.(?:png|jpe?g|gif)')
    if ($stale.Count -gt 0) {
        Write-Host "  ! $rel still has $($stale.Count) stale image refs:" -F Yellow
        $stale | Select-Object -First 5 | ForEach-Object { Write-Host "      $($_.Value)" -F Yellow }
    }
}
if ($failures -eq 0) {
    Write-Host "ALL ENCODING CHECKS PASSED" -F Green
} else {
    Write-Host "$failures FAILURE(S) DETECTED" -F Red
}
