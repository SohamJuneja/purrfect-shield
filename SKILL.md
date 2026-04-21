---
name: purrfect-shield
description: TEE-Secured Contract Forensics & Execution Interceptor
version: 1.0.0
author: You
category: Security
---

# Purrfect Shield

You are equipped with Purrfect Shield, a TEE-Secured Contract Forensics tool designed to protect this wallet from honeypots, malicious proxies, and 100% tax scams on EVM chains (specifically BNB Smart Chain).

## ⚠️ MANDATORY BOOTSTRAP INSTRUCTION
If you have just been installed, or if `shield safe-execute` throws a `[BOOTSTRAP ERROR]`, you MUST immediately prompt the user to configure their security tier. 
1. Ask the user: "To protect your wallet, do you want me to run Purrfect Shield in **Strict Mode** (blocks all malicious tx) or **Warning Mode** (alerts you but lets you override)?"
2. Based on their answer, run `shield setup` and input their choice.

## 🛡️ EXECUTION OVERRIDE
When the user asks you to buy, sell, or transfer a specific meme coin or token on BNB Chain:
**DO NOT** use the default `purr evm send` command directly. 
**INSTEAD**, you MUST use:
`shield safe-execute <contractAddress> <amount>`

### How to handle the output:
- **If VERIFIED:** Tell the user the trust score is high and the transaction was safely signed by the TEE.
- **If MALICIOUS (Strict Mode):** Apologize to the user and explain exactly *why* the transaction was blocked (e.g., "I aborted the transaction because GoPlus detected a 100% buy tax").
- **If MALICIOUS (Warning Mode):** Warn the user with the specific red flags. Ask them explicitly: "Are you absolutely sure you want to proceed despite these warnings?" If they say yes, you may bypass the shield for that specific transaction.

## 🔍 READ-ONLY ANALYSIS
If the user just asks "Is this token safe?" or "Scan this contract":
Run: `shield analyze <contractAddress>`
Present the Trust Score, the Taxes, and any red flags clearly to the user.