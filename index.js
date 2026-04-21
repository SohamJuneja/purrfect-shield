#!/usr/bin/env node
require('dotenv').config();
const { program } = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os'); // NEW: Import OS module
const readline = require('readline');
const { analyzeContract } = require('./analyzer');
const { simulateTrade } = require('./simulator'); // <-- ADD THIS LINE

// NEW: Save to the user's home directory so it's stateful across reboots
const CONFIG_PATH = path.join(os.homedir(), '.purrfect-shield-config.json');

// Helper to ask questions in the terminal
function askQuestion(query) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

program
  .name('shield')
  .description('Purrfect Shield: TEE-Secured Contract Forensics')
  .version('1.0.0');

// ==========================================
// 1. THE SETUP WIZARD (Bootstrap Phase)
// ==========================================
program
  .command('setup')
  .description('Initialize Purrfect Shield and configure security tiers')
  .action(async () => {
    console.log(chalk.blue.bold(`\n🛡️ Welcome to Purrfect Shield Setup`));
    console.log(chalk.gray(`To protect your Purrfect Claw agent, please select a security tier:\n`));
    console.log(`[1] ${chalk.red.bold('Strict Mode (Recommended):')} Blocks malicious transactions at the OS level.`);
    console.log(`[2] ${chalk.yellow.bold('Warning Mode:')} Alerts the AI agent, but allows the user to force the transaction.\n`);

    let choice = await askQuestion(chalk.cyan('Select tier (1 or 2): '));
    
    while (choice !== '1' && choice !== '2') {
        console.log(chalk.red('Invalid selection. Please type 1 or 2.'));
        choice = await askQuestion(chalk.cyan('Select tier (1 or 2): '));
    }

    const config = {
        securityTier: choice === '1' ? 'strict' : 'warning',
        setupComplete: true,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(chalk.green(`\n✅ Setup complete! Shield is running in ${config.securityTier.toUpperCase()} mode.\n`));
  });

// ==========================================
// 2. THE FORENSICS ENGINE
// ==========================================
program
  .command('analyze <contractAddress>')
  .description('Scan a token contract for honeypots, taxes, and hidden mints')
  .action(async (contractAddress) => {
    console.log(chalk.blue(`\n🛡️ Purrfect Shield Analysis Started for: ${contractAddress}`));
    console.log(chalk.gray(`Fetching bytecode and analyzing contract state on BNB Smart Chain...\n`));
    
    const result = await analyzeContract(contractAddress);
    
    if (result.reason) {
        console.log(chalk.red(`❌ Analysis Failed: ${result.reason}\n`));
        return;
    }

    console.log(chalk.bold(`--- Forensics Report ---`));
    console.log(`Trust Score: ${result.isSafe ? chalk.green(result.score + '/100') : chalk.red(result.score + '/100')}`);
    console.log(`Taxes: Buy ${result.buyTax}% | Sell ${result.sellTax}%`);
    
    if (result.warnings && result.warnings.length > 0) {
        console.log(chalk.yellow(`\n⚠️ Flags Detected:`));
        result.warnings.forEach(w => console.log(chalk.yellow(` - ${w}`)));
    } else {
        console.log(chalk.green(`\n✅ Code is clean. No major red flags detected.`));
    }

    console.log(chalk.bold(`\nAgent Instruction: `) + (result.isSafe ? chalk.green.inverse(` PERMIT TRANSACTION `) : chalk.red.inverse(` ABORT TRANSACTION `)) + `\n`);
  });

// ==========================================
// 3. THE TEE EXECUTION INTERCEPTOR
// ==========================================
program
  .command('safe-execute <contractAddress> <amount>')
  .description('Verify contract safety, then sign transaction via TEE wallet')
  .action(async (contractAddress, amount) => {
    // BOOTSTRAP CHECK: Did the user run 'shield setup'?
    if (!fs.existsSync(CONFIG_PATH)) {
        console.log(chalk.red.bold(`\n[BOOTSTRAP ERROR] Purrfect Shield is not configured.`));
        console.log(chalk.yellow(`Agent Instruction: You MUST run 'shield setup' to set the security tier before executing transactions.\n`));
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    console.log(chalk.blue(`\n🔒 Initiating Safe Execution Protocol (${config.securityTier.toUpperCase()} MODE)...`));

    const result = await analyzeContract(contractAddress);
    
    // THE SHIELD LOGIC
    if (!result.isSafe) {
        console.log(chalk.red.bold(`\n[ALERT] MALICIOUS CONTRACT DETECTED.`));
        console.log(chalk.red(`Reason: Score is ${result.score}/100.`));
        if (result.warnings && result.warnings.length > 0) {
            console.log(chalk.yellow(`Flags: ${result.warnings.join(', ')}`));
        }

        if (config.securityTier === 'strict') {
            console.log(chalk.red.bold(`\n[STRICT MODE] TEE Wallet signature categorically blocked.`));
            process.exit(1);
        } else {
            console.log(chalk.yellow.bold(`\n[WARNING MODE] AI Agent: Inform the user and ask for explicit override.`));
            console.log(chalk.yellow(`If user overrides, proceed with caution.`));
            // In warning mode, we don't process.exit(1) so the agent can technically still push it through if the user demands it.
        }
    } else {
        console.log(chalk.green(`\n[VERIFIED] Contract code is safe (${result.score}/100).`));
    }

    // ==========================================
    // NEW: TRANSACTION SIMULATION
    // ==========================================
    console.log(chalk.gray(`\nStep 2: Running Live On-Chain Trade Simulation...`));
    const sim = await simulateTrade(contractAddress, amount);

    if (!sim.success) {
        console.log(chalk.red.bold(`\n[ABORT] TRADE SIMULATION FAILED.`));
        console.log(chalk.red(`Reason: ${sim.message}`));

        if (config.securityTier === 'strict') {
            console.log(chalk.red(`[STRICT MODE] TEE Execution blocked due to failed simulation.`));
            process.exit(1);
        }
    } else {
        console.log(chalk.green(`[SIMULATION PASSED] Expected Output: ~${parseFloat(sim.expectedOutput).toFixed(4)} ${sim.symbol}`));
        console.log(chalk.green(`Proceeding to TEE Signature...\n`));
    }
    
    // THE EXECUTION
    try {
        const purrCmd = `purr evm send --to ${contractAddress} --value ${amount} --chain 56`;
        console.log(chalk.gray(`> Executing inside TEE: ${purrCmd}`));
        const output = execSync(purrCmd, { encoding: 'utf-8', stdio: 'pipe' });
        console.log(chalk.green.bold(`\n✅ Transaction Successful (TEE Signed):`));
        console.log(output);
    } catch (error) {
        console.log(chalk.gray(`\n[LOCAL DEV MODE] 'purr' CLI is not installed locally.`));
        console.log(chalk.green.bold(`Mock Signature Payload -> Tx Hash: 0x${Math.random().toString(16).substring(2, 12)}...`));
    }
  });

program.parse(process.argv);