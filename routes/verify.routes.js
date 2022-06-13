const router = require('express').Router();

// https://www.npmjs.com/package/merkletreejs
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const whiteList1LeafNodes = require('../db/hashesWL1.json');
const whitelist1MerkleTree = new MerkleTree(whiteList1LeafNodes, keccak256, {
  sortPairs: true,
});
const whiteList2LeafNodes = require('../db/hashesWL2.json');
const whitelist2MerkleTree = new MerkleTree(whiteList2LeafNodes, keccak256, {
  sortPairs: true,
});
const waitListLeafNodes = require('../db/hashesWaitList.json');
const waitlistMerkleTree = new MerkleTree(waitListLeafNodes, keccak256, {
  sortPairs: true,
});

router.get('/merkle', (req, res) => {
  const { address } = req.query;
  let merkleTree;
  const hashedAddress = keccak256(address).toString('hex');

  if (whiteList1LeafNodes.includes(hashedAddress)) {
    merkleTree = whitelist1MerkleTree;
  } else if (whiteList2LeafNodes.includes(hashedAddress)) {
    merkleTree = whitelist2MerkleTree;
  } else if (waitListLeafNodes.includes(hashedAddress)) {
    merkleTree = waitlistMerkleTree;
  }

  const proof = merkleTree?.getHexProof(hashedAddress) || [];

  // const whiteListRootHash = whitelistMerkleTree.getHexRoot();
  // console.log('ROOT', whiteListRootHash);
  // console.log('===========', hashedAddress);

  // TODO consider using toLowerCase for addresses
  // empty array means address is not in a list
  res.json({ proof });
});

router.get('/sign', (req, res) => {});

router.get('/', (req, res) => {});

// axios
//     .post('https://sig.io/isEligible/', {
//       wallet: selectedAccount,
//     })
//     .then((data) => {
//       document.getElementById(
//         'whitelised-info'
//       ).innerHTML = `Whitelisted : ${data.data.eligible}`;
//     });

module.exports = router;

// const SHA256 = require('crypto-js/sha256');

// const leaves = ['a', 'b', 'c'].map((x) => SHA256(x));
// const tree = new MerkleTree(leaves, SHA256);
// const root = tree.getRoot().toString('hex');
// const leaf = SHA256('a');
// const proof = tree.getProof(leaf);
// console.log(tree.verify(proof, leaf, root)); // true

// const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
// const badTree = new MerkleTree(badLeaves, SHA256)
// const badLeaf = SHA256('x')
// const badProof = tree.getProof(badLeaf)
// console.log(tree.verify(badProof, leaf, root)) // false
