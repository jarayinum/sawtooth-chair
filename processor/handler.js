
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')

const createAsset = require('./state');
const transferAsset = require('./state');
const getTransfer = require('./state');

var { PROCESSOR_FAMILY, PROCESSOR_NAMESPACE } = require("./constants");


class ChairHandler extends TransactionHandler {
    constructor () {
      super(PROCESSOR_FAMILY,['1.0'],[PROCESSOR_NAMESPACE])
    }
  
    apply (transactionProcessRequest, context) {

      const header = TransactionHeader.decode(transactionProcessRequest.header)
      const signer = header.signerPubkey
      const { action, asset, owner } = JSON.parse(transactionProcessRequest.payload)

      if (action === 'create') return createAsset(asset, signer, context)
      if (action === 'transfer') return transferAsset(asset, owner, signer, context)
      if (action === 'get') return getTransfer(asset, signer, context)

      return Promise.resolve().then(() => {
        throw new InvalidTransaction(
          'Please create or transfer'
        )
      })
    }
  }
  
  module.exports = ChairHandler;
  