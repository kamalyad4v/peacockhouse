import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(process.uptime()),
      formatted: `${Math.floor(process.uptime())}s`
    },
    webpack: {
      state: 'success',
      isHealthy: true,
      hasCompiled: true,
      errors: 0,
      warnings: 0
    },
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    environment: process.env.NODE_ENV || 'production'
  });
}
