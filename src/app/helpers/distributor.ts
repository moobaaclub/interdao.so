import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Leaf, MerkleDistributor } from '@sentre/utility'
import IPFS from 'shared/pdb/ipfs'
import { CID } from 'ipfs-core'

import configs from 'app/configs'
import { getCID } from './index'

const {
  sol: { utility },
} = configs

const ipfs = new IPFS()

const CURRENT_TIME = Number(new Date())
const ONE_DAY = 24 * 60 * 60 * 1000
const ENDED_AT = CURRENT_TIME + 15 * ONE_DAY

class Distributor {
  getTreeData = (pubkeys: PublicKey[]) => {
    const balanceTree: Leaf[] = pubkeys.map((pubkey, index) => {
      return {
        authority: pubkey,
        amount: new BN(1),
        startedAt: new BN(0),
        salt: MerkleDistributor.salt(index.toString()),
      }
    })
    const merkleDistributor = new MerkleDistributor(balanceTree)
    const dataBuffer = merkleDistributor.toBuffer()
    return dataBuffer
  }

  createDistributor = async (pubkeys: PublicKey[], mintAddress: string) => {
    const treeData = this.getTreeData(pubkeys)
    const merkleDistributor = MerkleDistributor.fromBuffer(treeData)

    const cid = await ipfs.set(treeData.toJSON().data)
    const {
      multihash: { digest },
    } = CID.parse(cid)

    const metadata = Buffer.from(digest)

    const { distributorAddress } = await utility.initializeDistributor({
      tokenAddress: mintAddress,
      total: merkleDistributor.getTotal(),
      merkleRoot: merkleDistributor.deriveMerkleRoot(),
      metadata,
      endedAt: ENDED_AT / 1000,
    })

    return distributorAddress
  }

  getMintAddress = async (distributorAddress: string) => {
    const distributor = await utility.program.account.distributor.fetch(
      distributorAddress,
    )
    return distributor.mint.toBase58()
  }

  getMerkleDistributor = async (distributorAddress: string) => {
    const distributor = await utility.program.account.distributor.fetch(
      distributorAddress,
    )
    const cid = await getCID(distributor.metadata)
    const data = await ipfs.get(cid)
    const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))
    return merkleDistributor
  }

  getRecipientData = async (
    walletAddress: string,
    distributorAddress: string,
  ) => {
    const merkleDistributor = await this.getMerkleDistributor(
      distributorAddress,
    )
    for (const recipient of merkleDistributor.receipients) {
      const authorityAddress = recipient.authority.toBase58()
      if (walletAddress === authorityAddress) return recipient
    }
  }

  getReceiptData = async (recipientData: Leaf, distributorAddress: string) => {
    if (!recipientData) return false
    const { salt } = recipientData
    const receiptAddress = await utility.deriveReceiptAddress(
      salt,
      distributorAddress,
    )
    const receiptData = await utility.getReceiptData(receiptAddress)

    return receiptData
  }

  claimToken = async (recipientData: Leaf, distributorAddress: string) => {
    if (!recipientData) throw new Error('You not on the list')

    const merkleDistributor = await this.getMerkleDistributor(
      distributorAddress,
    )
    const proof = merkleDistributor.deriveProof(recipientData)

    const { txId } = await utility.claim({
      distributorAddress,
      proof,
      data: recipientData,
    })
    return txId
  }
}

export default Distributor
