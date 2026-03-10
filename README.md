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


HONEYPOT API ARCHITECTURE

 ┌─────────────────────────────────────────────────────────────────┐
 │                        CLIENT (User)                            │
 │            (curl, Postman, Browser, Any HTTP Client)            │
 └────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
                    HTTP Request (GET/POST)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🌐 RENDER.COM HOSTING                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Node.js Runtime (v18+)                    │ │
│  └───────────────────────────┬─────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Express.js Framework                      │ │
│  └───────────────────────────┬─────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                express.raw() Middleware                     │ │
│  │              (Accepts ANY content type)                     │ │
│  └───────────────────────────┬─────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      ROUTE HANDLERS                         │ │
│  │  ┌─────────────────────────┐  ┌───────────────────────────┐ │ │
│  │  │      GET /              │  │   POST /api/honeypot      │ │ │
│  │  │   Health Check          │  │   Main Honeypot Endpoint  │ │ │
│  │  └───────────┬─────────────┘  └─────────────┬─────────────┘ │ │
│  └──────────────┼──────────────────────────────┼───────────────┘ │
│                 │                              │                 │
│                 ▼                              ▼                 │
│  ┌─────────────────────────┐  ┌───────────────────────────────┐ │
│  │   Response:             │  │     Authentication Logic      │ │
│  │   {"status":"ok",       │  │   Check x-api-key header      │ │
│  │    "service":"honeypot- │  │         ┌───────┴───────┐     │ │
│  │    api"}                │  │         ▼               ▼     │ │
│  └─────────────────────────┘  │  ┌──────────┐  ┌──────────┐   │ │
│                               │  │ Valid    │  │ Invalid  │   │ │
│                               │  │ Key ✅   │  │ Key ❌  │   │ │
│                               │  └────┬─────┘  └────┬─────┘   │ │
│                               │       │              │        │ │
│                               │       ▼              ▼        │ │
│                               │  ┌──────────┐  ┌──────────┐   │ │
│                               │  │ Success  │  │ 401      │   │ │
│                               │  │ Response │  │ Error    │   │ │
│                               │  └──────────┘  └──────────┘   │ │
│                               └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         📋 CONSOLE LOGS                        │
│                                                                 │
│  ✅ Server running on port 8080                                │
│  📢 Honeypot endpoint hit                                      │
│  ❌ Unauthorized attempt at: 2026-03-10T12:00:00Z              │
│  ✅ Authorized request at: 2026-03-10T12:01:00Z                │
│  Request body: {"test":"data"}                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
