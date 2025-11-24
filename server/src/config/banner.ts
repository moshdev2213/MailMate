import { env } from './env';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  whiteBg: '\x1b[47m',
  black: '\x1b[30m',
};

export function getBanner(): string {
  const mode = env.NODE_ENV.toUpperCase();
  let banner = '';

  switch (env.NODE_ENV) {
    case 'production':
      banner = `${colors.red}╔═══════════════════════════════════════╗${colors.reset}\n`;
      banner += `${colors.red}║ Server started in ${mode.padEnd(10)} mode║${colors.reset}\n`;
      banner += `${colors.red}╚═══════════════════════════════════════╝${colors.reset}`;
      break;
    case 'staging':
      banner = `${colors.yellow}╔═══════════════════════════════════════╗${colors.reset}\n`;
      banner += `${colors.yellow}║ Server started in ${mode.padEnd(10)} mode║${colors.reset}\n`;
      banner += `${colors.yellow}╚═══════════════════════════════════════╝${colors.reset}`;
      break;
    case 'development':
    default:
      banner = `${colors.whiteBg}${colors.black}╔═══════════════════════════════════════╗${colors.reset}\n`;
      banner += `${colors.whiteBg}${colors.black}║  Server started in ${mode.padEnd(10)} mode   ║${colors.reset}\n`;
      banner += `${colors.whiteBg}${colors.black}╚═══════════════════════════════════════╝${colors.reset}`;
      break;
  }

  return banner;
}

export default function displayBanner(): void {
  console.log('\n' + getBanner() + '\n');
}

