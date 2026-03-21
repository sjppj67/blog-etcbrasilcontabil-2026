# =================================================================
# SCRIPT POWERSHELL PARA RENOMEAR POSTS (VERSÃO PARA ARQUIVOS .md)
# =================================================================

$postsPath = ".\_posts\"
Write-Host "Iniciando o processo de renomeação na pasta: $postsPath" -ForegroundColor Green

# Alterado para procurar arquivos .md (que ainda não estão no formato Jekyll)
$arquivos = Get-ChildItem -Path $postsPath -Filter *.md | Where-Object { $_.BaseName -notmatch "^\d{4}-\d{2}-\d{2}-" }

if ($arquivos.Count -eq 0) {
    Write-Host "Nenhum arquivo .md que precisa ser formatado encontrado na pasta _posts. Saindo." -ForegroundColor Yellow
    exit
}

Write-Host "Encontrados $($arquivos.Count) arquivos para processar."

# Caracteres inválidos no Windows
$invalidChars = [System.IO.Path]::GetInvalidFileNameChars()
$regexInvalidChars = "[$([regex]::Escape($invalidChars))]"

foreach ($arquivo in $arquivos) {
    $nomeBase = $arquivo.BaseName
    
    # Extrai a data da última modificação
    $dataDoArquivo = $arquivo.LastWriteTime.ToString("yyyy-MM-dd")
    
    # Remove números iniciais (como "1 - ", "10 - ", etc.)
    $tituloLimpo = $nomeBase -replace "^\d+\s*-\s*(\d+[\.\d]*\s*)?", ""
    
    # Cria um slug válido para URL
    $slug = $tituloLimpo.ToLower()
    $slug = $slug -replace $regexInvalidChars, '' # Remove caracteres inválidos
    $slug = $slug -replace "[\s_]+", "-"
    $slug = $slug -replace "[^a-z0-9-]", ""
    $slug = $slug -replace "-{2,}", "-"
    $slug = $slug.Trim("-")

    # Limita o comprimento do slug
    if ($slug.Length -gt 80) {
        $slug = $slug.Substring(0, 80)
    }
    
    $novoNome = "$dataDoArquivo-$slug.md"  
    $novoCaminho = Join-Path -Path $postsPath -ChildPath $novoNome
    
    # Verifica se o arquivo já existe e adiciona um número se necessário
    $contador = 1
    while (Test-Path $novoCaminho) {
        $novoNome = "$dataDoArquivo-$slug-$contador.md"
        $novoCaminho = Join-Path -Path $postsPath -ChildPath $novoNome
        $contador++
    }
    
    try {
        Rename-Item -Path $arquivo.FullName -NewName $novoNome -ErrorAction Stop
        Write-Host "Renomeado: '$($arquivo.Name)' -> '$novoNome'" -ForegroundColor Green
    }
    catch {
        Write-Host "ERRO ao renomear '$($arquivo.Name)'." -ForegroundColor Red
        Write-Host "Detalhes: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Processo de renomeação concluído!" -ForegroundColor Green