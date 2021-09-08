const Web3 = require('web3')
const utils = require('./utils')

const options = {
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 60,
  transactionPollingTimeout: 480
};

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpcapi.fantom.network"), null, options)
const Rarity_attribute_contract_address = '0xB5F5AF1087A8DA62A23b08C00C6ec9af21F397a1'
const abi = require('./ra_abi.json')
const contract = new web3.eth.Contract(abi, Rarity_attribute_contract_address)

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    
async function main() {
  
  if (process.argv.length < 4) {
    console.log('argv: private_key method arguments')
    console.log('\t method:')
    console.log('\t\t point_buy -r summoner_id')
    console.log('\t\t or')
    console.log('\t\t point_buy -s summoner_id strength dexterity constitution intelligence wisdom charisma')
    
    return
  }

  let private_key = process.argv[2]
  if (private_key.startsWith('0x')) private_key = private_key.slice(2)
  
  if (process.argv[3] == 'point_buy') {
    let summoner_id = parseInt(process.argv[5])
    console.log('\nsummoner id:' + summoner_id)
    let result = await contract.methods.character_created(summoner_id).call()
    if (result == true) {
      console.log('The character has been created')

      return
    } 
    
    let available_attributes = utils.read_from_file('ra_point_buy_inputs.txt')
    if (process.argv[4] == '-r') { //random select attributes
      let attribute = available_attributes[Math.floor(Math.random() * available_attributes.length)].split(',')
      console.log('seleted attribute: ' + attribute)
      let method_sig = web3.eth.abi.encodeFunctionSignature('point_buy(uint256,uint32,uint32,uint32,uint32,uint32,uint32)')
      await method1(private_key, summoner_id, attribute[0], attribute[1], attribute[2], attribute[3], attribute[4], attribute[5], method_sig)

    } else if (process.argv[4] == '-s') {

    } else {
      console.log('bad arguments')
    }

    result = await contract.methods.tokenURI(summoner_id).call()
    let b64 = result.slice(result.indexOf('base64,')+7)
    await utils.save_svg(b64, summoner_id + '_ra')

  } else {
    console.log('bad method name')
  }
}

async function method1(private_key, int256_id, _str, _dex, _const, _int, _wis, _cha, method_sig) {

  let gas_price = 8e10
  let account = web3.eth.accounts.privateKeyToAccount(private_key)
  let from_ = account.address
  console.log('from:' + from_)
  
  let nonce = await web3.eth.getTransactionCount(from_)
  console.log('nonce:' + nonce)
  
  let gas_limit = 210000

  let data = method_sig + utils.add_pre_zero(int256_id.toString(16, 'hex')) 
      + utils.add_pre_zero(parseInt(_str).toString(16, 'hex')) 
      + utils.add_pre_zero(parseInt(_dex).toString(16, 'hex')) 
      + utils.add_pre_zero(parseInt(_const).toString(16, 'hex'))
      + utils.add_pre_zero(parseInt(_int).toString(16, 'hex')) 
      + utils.add_pre_zero(parseInt(_wis).toString(16, 'hex')) 
      + utils.add_pre_zero(parseInt(_cha).toString(16, 'hex'))

  let signed_tx = utils.sign_eth_tx(private_key, nonce, gas_limit, gas_price, from_, data, Rarity_attribute_contract_address)
  
  try
	{
		var tran = web3.eth.sendSignedTransaction('0x' + signed_tx);
		console.log('transaction sent, wait for response.')
		tran.on('confirmation', (confirmationNumber, receipt) => {
			console.log('confirmation: ' + confirmationNumber);
      if (confirmationNumber >= 2) {
        process.exit(0)
      }
		});
		tran.on('transactionHash', hash => {
			console.log('hash:' + hash);
			
		});
		tran.on('receipt', receipt => {
			console.log('receipt:' + receipt);
			return
		});
		tran.on('error', (err)=>{
			console.log(err);  
			//return
		});
	} 
	catch (err)
	{
		console.log('Exception occured when waiting a response.')	
	}

}

main()