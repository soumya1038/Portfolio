/**
 * Environment variable validation and type safety
 */

interface EnvConfig {
  NEXT_PUBLIC_PORTFOLIO_NAME: string;
  NEXT_PUBLIC_ADMIN_PASSWORD: string;
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_NODE_ENV: 'development' | 'production';
}

function validateEnv(): EnvConfig {
  const requiredVars = [
    'NEXT_PUBLIC_PORTFOLIO_NAME',
    'NEXT_PUBLIC_ADMIN_PASSWORD',
  ];

  const missing = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file'
    );
  }

  return {
    NEXT_PUBLIC_PORTFOLIO_NAME: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || 'Portfolio',
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_NODE_ENV: (process.env.NEXT_PUBLIC_NODE_ENV as 'development' | 'production') || 'development',
  };
}

export const env = validateEnv();
