import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";

export const signTransaction = (secretKeyBase58, publicKey, timestamp) => {
    try {
        const keypair = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
        
        // Create message bytes the same way as the wallet
        const message = `Sign in to pump.fun: ${timestamp}`;
        const messageBytes = new TextEncoder().encode(message);
        
        // Sign using detached signature
        const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
        
        // Convert signature to base58 like in the successful request
        const signatureBase58 = bs58.encode(signature);
        
        // Verify signature
        const verified = nacl.sign.detached.verify(
            messageBytes,
            signature,
            keypair.publicKey.toBytes()
        );
        
        if (!verified) {
            throw new Error("Signature verification failed");
        }
        
        return signatureBase58;
    } catch (error) {
        throw new Error(`Signing error: ${error.message}`);
    }
};

export const createWallet = () => {
    const newKeypair = Keypair.generate();
    return {
        publicKey: newKeypair.publicKey.toBase58(),
        secretKeyBase58: bs58.encode(newKeypair.secretKey)
    };
};

export const createWallets = (amt) => Array.from({ length: amt }, createWallet);