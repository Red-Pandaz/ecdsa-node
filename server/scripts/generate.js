const secp = require('ethereum-cryptography/secp256k1').secp256k1
// console.log(secp.Signature)
// const { toHex } = require('ethereum-cryptography/utils')
// const privateKey = secp.utils.randomPrivateKey()
// console.log('private key: ', toHex(privateKey))
// const publicKey = secp.getPublicKey(privateKey)
// console.log('public key: ', toHex(publicKey))


// import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// You pass either a hex string, or Uint8Array
const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
const publicKey = secp.getPublicKey(privateKey);
const signature = secp.sign(messageHash, privateKey);
console.log('signature: ', signature)
const isSigned = secp.verify(signature, messageHash, publicKey);
console.log(isSigned)