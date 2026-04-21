const { ethers } = require('ethers');
const chalk = require('chalk');

async function simulateTrade(tokenAddress, amountInBNB) {
    try {
        // Connect directly to BNB Smart Chain public RPC
        const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        
        // PancakeSwap V2 Router & WBNB
        const routerAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
        const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
        
        if (tokenAddress.toLowerCase() === wbnbAddress.toLowerCase()) {
            return { success: true, expectedOutput: amountInBNB, symbol: "WBNB" };
        }

        // Minimal ABI to simulate the trade and get token details
        const routerAbi = ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"];
        const tokenAbi = ["function decimals() view returns (uint8)", "function symbol() view returns (string)"];
        
        const routerContract = new ethers.Contract(routerAddress, routerAbi, provider);
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        
        const amountInWei = ethers.parseEther(amountInBNB.toString());
        const path = [wbnbAddress, tokenAddress];
        
        // 1. Simulate the routing (Throws error if liquidity is drained or trading is paused)
        const amounts = await routerContract.getAmountsOut(amountInWei, path);
        
        // 2. Fetch token metadata for the report
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        
        // 3. Format the expected output
        const expectedOutput = ethers.formatUnits(amounts[1], decimals);

        return { success: true, expectedOutput, symbol };

    } catch (error) {
        // If the route fails, it's usually a rug pull (no liquidity) or a hard-coded revert in the token
        return { success: false, message: "Simulation Reverted: Insufficient Liquidity or Trading Paused (High Risk of Rug Pull)." };
    }
}

module.exports = { simulateTrade };