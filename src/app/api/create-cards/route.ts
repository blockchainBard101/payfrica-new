import { NextRequest, NextResponse } from 'next/server';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { createHmac, randomBytes, createCipheriv } from 'crypto';
import argon2 from 'argon2';

const SECRET_KEY_2 = process.env.SECRET_KEY_2 || 'fallback_secret';

function generateSalt(length = 16): string {
  return randomBytes(length).toString('hex');
}

function hashWithSaltAndKey(password: string, salt: string): Uint8Array {
  const hmac = createHmac('sha256', process.env.SECRET_KEY_1 || 'secret');
  hmac.update(password + salt);
  return Uint8Array.from(hmac.digest());
}

async function generateKey(password: string, salt: Buffer): Promise<Buffer> {
  return await argon2.hash(password + SECRET_KEY_2, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true,
    timeCost: 4,
    memoryCost: 2 ** 16,
    parallelism: 2,
  });
}

async function encryptKeyphrase(keyphrase: string, password: string) {
  const iv = randomBytes(12);
  const salt = randomBytes(16);
  const key = await generateKey(password, salt);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(keyphrase, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const pass_salt = generateSalt();
  const hashed_password = hashWithSaltAndKey(password, pass_salt);
  const hashed_password_str = Buffer.from(hashed_password).toString('hex');

  return {
    encrypted: [iv.toString('hex'), salt.toString('hex'), encrypted.toString('hex'), tag.toString('hex')].join(':'),
    hashed_password_str,
    pass_salt,
  };
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Missing password' }, { status: 400 });

  const keypair = Ed25519Keypair.generate();
  const publicKey = keypair.getPublicKey().toSuiAddress();
  const privateKey = keypair.getSecretKey().toString();

  const encryptedData = await encryptKeyphrase(privateKey, password);

  return NextResponse.json({
    publicKey,
    ...encryptedData,
  });
}