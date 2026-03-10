"🚀 Testing Honeypot API"

✅ Test 1: Root Endpoint"
curl.exe https://honeypot-api-1-66i1.onrender.com/

❌ Test 2: Unauthorized Access"
curl.exe -X POST https://honeypot-api-1-66i1.onrender.com/api/honeypot

🔐 Test 3: Authorized Access"
curl.exe -X POST -H "x-api-key: super_secret_honeypot_key_123" https://honeypot-api-1-66i1.onrender.com/api/honeypot

✅ All tests completed!"

✅ Test 1: Root Endpoint
{"status":"ok","service":"honeypot-api"}

❌ Test 2: Unauthorized Access
{"status":"error","reply":"Unauthorized"}

🔐 Test 3: Authorized Access
{"status":"success","reply":"Why is my account being suspended?"}
