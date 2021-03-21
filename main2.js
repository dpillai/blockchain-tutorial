const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

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
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: "+ this.hash)
    }

}



class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2021", "Genesis-Block", 0);
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("transactions mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction) {
        
        this.pendingTransactions.push(transaction);
        // console.log('pending transactions: ' + JSON.stringify(this.pendingTransactions, null, 4));
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.from == address) {
                    balance -= trans.amount;
                }
                if(trans.to == address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
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

deepakCoin.createTransaction(new Transaction('address1', 'address2', 100));
deepakCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Starting mining...');
deepakCoin.minePendingTransactions('my-address');

console.log("my balance: " + deepakCoin.getBalanceOfAddress('my-address'));

deepakCoin.createTransaction(new Transaction('my-address', 'address1', 50));
console.log('Starting mining again...');
deepakCoin.minePendingTransactions('my-address');

console.log("my balance: " + deepakCoin.getBalanceOfAddress('my-address'));
// //console.log(JSON.stringify(deepakCoin, null, 4));