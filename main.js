const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        console.log(Array(difficulty + 1).join("0"));
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(this.nonce)
        console.log("Block mined: "+ this.hash)
    }

}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block("01/01/2021", "Genesis-Block",0);
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock) {

        if(this.isChainValid) {

            newBlock.previousHash = this.getLatestBlock().hash;
            newBlock.mineBlock(this.difficulty);
            
            this.chain.push(newBlock);
    
        }
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock =  this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

deepakCoin = new BlockChain();
// console.log("Mining block 1 ....");

// deepakCoin.addBlock(new Block(1, "02/01/2021", {amount: 4}));

// console.log("Mining block 2 ....");
// deepakCoin.addBlock(new Block(2, "03/01/2021", {amount: 10}));

// //console.log(JSON.stringify(deepakCoin, null, 4));
// // console.log("is chain valid: " + deepakCoin.isChainValid());
// // deepakCoin.chain[1].data = {amount: 100};
// // deepakCoin.chain[1].calculateHash();

// // console.log("is chain valid: " + deepakCoin.isChainValid());