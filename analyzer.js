const axios = require('axios');
const chalk = require('chalk');

async function analyzeContract(contractAddress) {
    try {
        // Chain ID 56 is BNB Smart Chain
        // We use GoPlus Security API to get real-time forensics
        const url = `https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=${contractAddress.toLowerCase()}`;
        const response = await axios.get(url);
        
        const data = response.data.result[contractAddress.toLowerCase()];
        
        if (!data) {
            return { isSafe: false, score: 0, reason: "Contract not found or not verified on BNB Chain." };
        }

        let score = 100;
        let warnings = [];

        // 🚨 Critical Vulnerabilities
        if (data.is_honeypot === "1") { score -= 100; warnings.push("CRITICAL: Honeypot detected! You cannot sell this token."); }
        if (data.is_proxy === "1") { score -= 20; warnings.push("Proxy contract: The developer can change the contract logic at any time."); }
        if (data.cannot_sell_all === "1") { score -= 50; warnings.push("Cannot sell all: Malicious limit on selling."); }
        if (data.transfer_pausable === "1") { score -= 30; warnings.push("Pausable: The owner can halt trading completely."); }
        if (data.can_take_back_ownership === "1") { score -= 30; warnings.push("Ownership can be reclaimed by the dev."); }
        
        // 💸 Tax Analysis
        const buyTax = parseFloat(data.buy_tax || 0) * 100;
        const sellTax = parseFloat(data.sell_tax || 0) * 100;
        
        if (buyTax > 10) { score -= 20; warnings.push(`High Buy Tax: ${buyTax.toFixed(2)}%`); }
        if (sellTax > 10) { score -= 30; warnings.push(`High Sell Tax: ${sellTax.toFixed(2)}%`); }

        // Ensure score doesn't drop below 0
        score = Math.max(0, score);
        
        // Our strict threshold for the Purrfect Claw Agent
        const isSafe = score >= 80; 

        return { isSafe, score, warnings, buyTax: buyTax.toFixed(1), sellTax: sellTax.toFixed(1) };
    } catch (error) {
        console.error(chalk.red("API request failed:"), error.message);
        return { isSafe: false, score: 0, reason: "Network error while connecting to Security Oracle." };
    }
}

module.exports = { analyzeContract };