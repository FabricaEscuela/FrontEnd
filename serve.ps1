$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$port = 5500
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'text/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.ico'  = 'image/x-icon'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "CodeForge ready at http://localhost:$port - Press Ctrl+C to stop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        try {
            if ($context.Request.HttpMethod -ne 'GET') {
                $response.StatusCode = 405
                $body = [System.Text.Encoding]::UTF8.GetBytes('Method not allowed')
                $response.OutputStream.Write($body, 0, $body.Length)
                continue
            }

            $relativePath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }
            $relativePath = $relativePath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
            if (-not $filePath.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
                $response.OutputStream.Write($body, 0, $body.Length)
                continue
            }

            if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                $response.StatusCode = 404
                $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
                $response.OutputStream.Write($body, 0, $body.Length)
                continue
            }

            $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $response.ContentType = $mimeTypes[$extension]
            if (-not $response.ContentType) { $response.ContentType = 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        finally {
            $response.Close()
        }
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
