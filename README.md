# 🛡️ Purrfect Shield
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Chain](https://img.shields.io/badge/chain-BNB_Smart_Chain-F3BA2F.svg) ![Security](https://img.shields.io/badge/security-TEE_Enclave-success.svg)

**A TEE-Secured Contract Forensics and Execution Interceptor for Purrfect Claw Agents.**

Purrfect Shield is a Web3 security middleware built for the **Pieverse Skill Store**. It solves a critical vulnerability in autonomous AI agents: they blindly sign malicious smart contracts. By intercepting the execution intent at the OS level, Purrfect Shield ensures an AI agent's TEE hardware wallet only signs mathematically proven, rug-free transactions.

---

## ⚡ Core Features

* **🛡️ Stateful Execution Blocking:** Interactive bootstrapper (`setup`) allows users to define security tiers (Warning vs. Strict Mode), saving state locally to block malicious commands before they hit the hardware.
* **🔍 GoPlus Forensics Interceptor:** Real-time bytecode analysis detects honeypots, hidden mints, malicious proxies, and 100% dev taxes on the BNB Smart Chain.
* **📈 Live On-Chain AMM Simulation:** Queries public BNB RPC nodes via `ethers.js` to simulate the exact trade route, reverting the transaction if liquidity is drained or trading is paused.
* **⚙️ Dynamic Auto-Slippage:** Eliminates UX friction by dynamically calculating optimal DEX slippage (`Base 0.5% + Contract Tax`) to prevent safe trades from failing.

---

## 🏗️ Architecture Flow

Unlike standard "scanners", Purrfect Shield operates as an intercept pipeline:

```text
[ LLM Intent ] --> User says: "Buy $DOGE2 on BNB"
      │
      ▼
[ SKILL.md ] ----> Routes execution away from native wallet to Purrfect Shield.
      │
      ▼
[ GoPlus API ] --> FORENSICS: Is it a honeypot? -> (YES) -> 🚫 OS-LEVEL ABORT
      │
      ▼ (NO)
[ RPC Node ] ----> SIMULATION: Is liquidity drained? -> (YES) -> 🚫 OS-LEVEL ABORT
      │
      ▼ (NO)
[ Auto-Slip ] ---> OPTIMIZATION: Calc Base Slippage + Token Tax.
      │
      ▼
[ TEE Wallet ] --> BROADCAST: Payload passed to `purr evm send` for secure signature.
```

---

## 🚀 Installation & Setup

Clone the repository into your Purrfect Claw agent's environment:

```bash
git clone [https://github.com/SohamJuneja/purrfect-shield.git](https://github.com/SohamJuneja/purrfect-shield.git)
cd purrfect-shield
npm install
```

**Environment Variables:**
Create a `.env` file in the root directory (optional, but recommended if using premium RPCs):
```env
# Optional: Add your custom RPC or API keys here if scaling
BSC_RPC_URL=[https://bsc-dataseed.binance.org/](https://bsc-dataseed.binance.org/)
```

---

## 💻 Usage & CLI Commands

### 1. Bootstrapping the Shield
Before the agent can trade, the user must initialize the security tier.
```bash
node index.js setup
```
*Prompts the user to select `[1] Strict Mode` (Hard blocking) or `[2] Warning Mode`.*

### 2. Safe Execution (The Interceptor)
When the AI agent intends to swap/buy a token, it executes this command instead of the raw `purr` command.

```bash
# Syntax: node index.js safe-execute <contract_address> <amount_in_bnb>
node index.js safe-execute 0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3 0.1
```

**Example Outputs:**
* **Malicious Token (Safemoon):** 🚫 Categorically blocks execution due to 100% buy tax and dev-reclaimable ownership.
* **Safe Token (CAKE):** ✅ Passes forensics, simulates the expected output (~41 CAKE), sets Auto-Slippage to 0.5%, and triggers the TEE `purr evm send` command.

---

## 🏆 Bounty Alignment (AI Sprint Hackathon)
**"Build Web3 Skills for Purrfect Claw Agents"**
* **Native TEE Integration:** Directly integrates with the `purr` CLI to execute safe transactions from within the hardware-isolated environment.
* **Immediate Utility:** Provides immediate, quantifiable financial protection for the entire Pieverse ecosystem by preventing agent-wallet drain attacks.
