import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Portfolio from '../src/models/Portfolio.js';

dotenv.config();

const rawTargetUrl = (process.env.KEEP_AWAKE_TARGET_URL || '').trim();
const targetWithProtocol =
  rawTargetUrl.startsWith('http://') || rawTargetUrl.startsWith('https://')
    ? rawTargetUrl
    : rawTargetUrl
    ? `https://${rawTargetUrl}`
    : '';
const targetUrl = targetWithProtocol.replace(/\/+$/, '');

if (!targetUrl) {
  console.error('[KeepAwakeCron] KEEP_AWAKE_TARGET_URL is required');
  process.exit(1);
}

const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const run = async () => {
  await connectDB();

  const portfolio = await Portfolio.getPortfolio();
  const enabled = Boolean(portfolio?.ownerSettings?.keepServerAwake);

  if (!enabled) {
    console.log('[KeepAwakeCron] Disabled in owner settings. Skipping ping.');
    return;
  }

  const healthUrl = `${targetUrl}/health?cronPing=${Date.now()}`;
  const response = await fetch(healthUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'p-folio-keep-awake-cron',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`[KeepAwakeCron] Ping failed (${response.status}): ${body}`);
  }

  console.log(`[KeepAwakeCron] Ping success: ${healthUrl}`);
};

run()
  .catch((error) => {
    console.error('[KeepAwakeCron] Error:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });
