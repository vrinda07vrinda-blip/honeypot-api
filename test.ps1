$headers = @{
    "x-api-key" = "super_secret_honeypot_key_123"
    "Content-Type" = "application/json"
}

$body = @{
    "test" = "data"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://honeypot-api-1-66i1.onrender.com/api/honeypot" -Method Post -Headers $headers -Body $body
Write-Host "Response:" $response