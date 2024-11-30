const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02a324ba4f2f553e4459a5852c611523eeee28df3834446de5d7b7e87a5552de61": 100,
  "022bd4e3752571770d74da2d25654e3b9f299efe571c7d276610e8d55f42f35614": 50,
  "0310e42d180aef29e956dbdf16176d563700c38081b7d3f66023ea12a74eae6708": 75,
};
const privKeys = {
  '02a324ba4f2f553e4459a5852c611523eeee28df3834446de5d7b7e87a5552de61': 'bdf5c23fbd7b74627b878559ea18ee3a5da0d5083db98680c3280ae55c8e77dc',
  '022bd4e3752571770d74da2d25654e3b9f299efe571c7d276610e8d55f42f35614': '42485524d70a909913ed664728d604ee245cc7e375d298dd59341c7517c1bcdf',
  '0310e42d180aef29e956dbdf16176d563700c38081b7d3f66023ea12a74eae6708': '972fe60d4c9ee05b2924f39933e1c436041a33cd77a82d35956d03f716eadd3f',
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: Get signature from client
  // Recover address from signature
  const { sender, recipient, amount, messageHash, signature, publicKey } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);
  if(!secp.verify(signature, messageHash, publicKey)){
    res.status(400).send({ message: "Invalid signature!" });
  } else{
    console.log('verified')
  }
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
