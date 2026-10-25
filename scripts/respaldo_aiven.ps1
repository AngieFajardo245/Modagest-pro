$ErrorActionPreference = "Stop"

$raiz = Split-Path $PSScriptRoot -Parent
$carpeta = Join-Path $raiz "backups"
$ca = Join-Path $raiz "certificados\ca.pem"
$dump = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss-fff"

New-Item -ItemType Directory -Path $carpeta -Force | Out-Null

$archivo = Join-Path $carpeta "modagest_pro_aiven_$fecha.sql"
$parcial = "$archivo.partial"
$registro = Join-Path $carpeta "respaldo_aiven.log"

try {
    if (!(Test-Path $ca)) { throw "No se encontro el certificado CA." }
    if (!(Test-Path $dump)) { throw "No se encontro mysqldump." }

    & $dump --login-path=modagest_aiven_backup `
        --protocol=TCP `
        --ssl-mode=VERIFY_IDENTITY "--ssl-ca=$ca" `
        --single-transaction --set-gtid-purged=OFF `
        --no-tablespaces --column-statistics=0 `
        --default-character-set=utf8mb4 `
        --routines --triggers --events `
        "--result-file=$parcial" modagest_pro

    if ($LASTEXITCODE -ne 0) { throw "mysqldump devolvio un error." }
    if (!(Test-Path $parcial)) { throw "No se genero el archivo." }
    if ((Get-Item $parcial).Length -eq 0) { throw "El respaldo esta vacio." }

    Move-Item -LiteralPath $parcial -Destination $archivo

    $hash = (Get-FileHash $archivo -Algorithm SHA256).Hash
    $hash | Set-Content "$archivo.sha256" -Encoding ASCII
    $bytes = (Get-Item $archivo).Length

    "$(Get-Date -Format s) | OK | $bytes bytes | $archivo | SHA256=$hash" |
        Add-Content $registro

    Write-Host "Respaldo creado: $archivo"
    Write-Host "Tamano: $bytes bytes"
    Write-Host "SHA256: $hash"
    exit 0
}
catch {
    if (Test-Path $parcial) {
        Remove-Item -LiteralPath $parcial
    }

    "$(Get-Date -Format s) | ERROR | $($_.Exception.Message)" |
        Add-Content $registro

    Write-Error $_ -ErrorAction Continue
    exit 1
}