const router = require('express').Router();

// https://www.npmjs.com/package/merkletreejs
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const whiteListLeafNodes = require('../db/hashes.json');
const whitelistMerkleTree = new MerkleTree(whiteListLeafNodes, keccak256, {
  sortPairs: true,
});

router.get('/merkle', (req, res) => {
  const { address } = req.query;

  const hashedAddress = keccak256(address).toString('hex');

  const proof = whitelistMerkleTree.getHexProof(hashedAddress);

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
