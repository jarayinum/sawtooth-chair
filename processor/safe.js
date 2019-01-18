const crypto = require("crypto");

const getAddress = (key, length = 64) => {
    return crypto.createHash('sha512').update(key).digest('hex').slice(0, length)
  }
  
const PROCESSOR_FAMILY = 'chair'
const PROCESSOR_NAMESPACE = getAddress(PROCESSOR_FAMILY, 6)

const assetAddress = name => PROCESSOR_NAMESPACE + '00' + getAddress(name, 62)
const transferAddress = asset => PROCESSOR_NAMESPACE + '01' + getAddress(asset, 62)

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

const createAsset = (asset, owner, context) => {
    const address = assetAddress(asset)
  
    return context.get([address])
      .then(entries => {
        const entry = entries[address]

        entries[address] = Buffer.from("Hello" + asset + owner + context);

        if (entry && entry.length > 0) {
          throw new InvalidTransaction('already used this name')
        }
        return context.set({
          [address]: encode({name: asset, owner}).then(function(result){
            console.log("success", result)
          }).catch(function(error){
            console.log(error,"Error")
          })
        })
      })
  }
  
  const transferAsset = (asset, owner, signer, context) => {
    const address = transferAddress(asset)
    const assetAddress = assetAddress(asset)
  
    return context.get([assetAddress])
      .then(entries => {
        const entry = entries[assetAddress]
        if (!entry || entry.length === 0) {
          throw new InvalidTransaction('Asset does not exist')
        }
  
        if (signer !== decode(entry).owner) {
          throw new InvalidTransaction('Only an Asset owner transfer it')
        }
  
        return context.set({
          [address]: encode({asset, owner}).then(function(result){
            console.log("transferred", result)
          }).catch(function(error){
            console.log(error,"Error")
          })
        })
      })
  }
  const getTransfer = (asset, signer, context) => {
    const address = transferAddress(asset)
  
    return context.get([address])
      .then(entries => {
        const entry = entries[address]
        if (!entry || entry.length === 0) {
          throw new InvalidTransaction('not transferred')
        }
        console.log(entry.toString())
        if (signer !== decode(entry).owner) {
          throw new InvalidTransaction(
            'chair get by new owner'
          )
        }
  
        return context.set({
          [address]: Buffer(0),
          [assetAddress(asset)]: encode({name: asset, owner: signer}).then(function(result){
            console.log("new owner", result)
          }).catch(function(error){
            console.log(error,"Error")
          })
        })
      })
  }
  
module.exports = createAsset
module.exports = transferAsset
module.exports = getTransfer