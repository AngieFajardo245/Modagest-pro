$ErrorActionPreference = "Stop"

$mysqldump = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$carpeta = "C:\Users\USER\modagest-pro\backups"
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$archivo = Join-Path $carpeta "modagest_pro_$fecha.sql"
$registro = Join-Path $carpeta "respaldo.log"

New-Item -ItemType Directory -Path $carpeta -Force | Out-Null

& $mysqldump `
  --login-path=modagest_backup `
  --protocol=TCP `
  --single-transaction `
  --routines `
  --triggers `
  --no-tablespaces `
  --column-statistics=0 `
  --default-character-set=utf8mb4 `
  "--result-file=$archivo" `
  modagest_pro

if ($LASTEXITCODE -ne 0) {
    throw "No fue posible generar el respaldo."
}

"$fecha | Respaldo creado | $archivo" | Add-Content $registro
Write-Host "Respaldo creado correctamente:"
Write-Host $archivo