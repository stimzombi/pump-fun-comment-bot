import axios from "axios";
import { createWallet, signTransaction } from "./utils.js";
import fs from "fs";
import chalk from "chalk";

const comments = JSON.parse(fs.readFileSync("./comments.json", "utf-8"));
const processedTargets = new Set();
const walletPool = new Set();
const MAX_WALLET_POOL = 10;
const WALLET_ROTATION_INTERVAL = 1000 * 60 * 5; // 5 minutes


const sleep = ms => new Promise(r => setTimeout(r, ms));

const rateLimiter = {
    tokens: 10,
    lastRefill: Date.now(),
    refillRate: 1000, // 1 token per second
    maxTokens: 10,

    async consume() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        this.tokens = Math.min(this.maxTokens, this.tokens + timePassed / this.refillRate);
        this.lastRefill = now;

        if (this.tokens < 1) {
            const waitTime = (1 - this.tokens) * this.refillRate;
            await sleep(waitTime);
            this.tokens = 1;
        }

        this.tokens -= 1;
    }
};

const getOrCreateWallet = () => {
    if (walletPool.size < MAX_WALLET_POOL) {
        const wallet = createWallet();
        walletPool.add(wallet);
        return wallet;
    }
    return Array.from(walletPool)[Math.floor(Math.random() * walletPool.size)];
};

const rotateWallets = () => {
    walletPool.clear();
};


// REDACTED, CONTACT ME ON TG TO PURCHASE FULL SCRIPT https://t.me/ccc666333
