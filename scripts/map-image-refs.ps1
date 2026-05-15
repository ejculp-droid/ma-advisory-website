# Map every image reference in every HTML file
$root = 'C:\Users\ejcul\OneDrive - RTO Advisory\Update RTO Site Collateral'
$files = Get-ChildItem -Path $root -Recurse -File -Include *.html -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\|\\netlify\\functions\\node_modules\\|\\images-optimized\\' }

foreach ($f in $files) {
    $rel = $f.FullName.Substring($root.Length + 1)
    $txt = [System.IO.File]::ReadAllText($f.FullName)
    $matches = [regex]::Matches($txt, '(?i)["''(]([^"''\s)<>]*?(?:assets/images|/images/)[^"''\s)<>]*?\.(?:png|jpe?g|webp|gif|svg|ico))["'')]')
    if ($matches.Count -gt 0) {
        Write-Host "=== $rel ($($matches.Count) refs) ==="
        $u = $matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
        $u | ForEach-Object { Write-Host "  $_" }
    }
}
