import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes, hexToBytes, } from "ethereum-cryptography/utils";


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");


  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      // Create a message object
      const message = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
      };
  
      const messageBytes = utf8ToBytes(JSON.stringify(message)); 
      const messageHash = keccak256(messageBytes); 
  
      
      const privateKeyBytes = hexToBytes(privateKey); 
      console.log('private key bytes ', privateKeyBytes);
  

      const signedMessage = secp.secp256k1.sign(messageHash, privateKeyBytes);
      console.log(signedMessage);
      const signature = {
        r: signedMessage.r.toString(),
        s: signedMessage.s.toString(), 
        recovery: signedMessage.recovery,
      };
  
  
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        message: toHex(messageHash),
        signature: signature, 
        publicKey: toHex(secp.secp256k1.getPublicKey(privateKeyBytes)),
      });
  
      setBalance(balance);
    } catch (ex) {
      alert(ex.message);
    }
  }
  
  

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
