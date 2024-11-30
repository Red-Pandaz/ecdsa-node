import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    try {
      evt.preventDefault()
      // Get the private key input as a string
      const privateKey = evt.target.value.trim();
      console.log(privateKey)
  
      // Validate the input to ensure it's a valid 64-character hex string
      if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
        throw new Error("Invalid private key format. Must be a 64-character hex string.");
      }
  
      // Prefix the private key with '0x' if needed
      const prefixedKey = `0x${privateKey}`;
      console.log(prefixedKey)
  
      // Generate the public key
      const address = toHex(secp.secp256k1.getPublicKey(privateKey, true)); // Compressed public key
      setPrivateKey(privateKey); // Save private key without prefix in the state
      setAddress(address);
  
      // Fetch and update the balance for the generated address
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
  
      // Reset states in case of invalid input
      setPrivateKey("");
      setAddress("");
      setBalance(0);
    }
  }
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
