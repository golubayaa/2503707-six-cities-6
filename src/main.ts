import { runCLI as run } from './cli/cli.js'; // <-- путь к cli.ts после компиляции

const args = process.argv.slice(2);
run(args).catch((error) => {
  console.error('Ошибка:', error);
  throw error;
});

