var {PROCESSOR_NAMESPACE} = require("./constants");
const _hash = require("./lib")

const assetAddress = (name) => PROCESSOR_NAMESPACE + _hash(name)
const transferAddress = (asset) => PROCESSOR_NAMESPACE + _hash(asset)

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