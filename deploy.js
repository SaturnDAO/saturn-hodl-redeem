require('dotenv').config()
const { create, globSource } = require('ipfs-http-client')
const itlast = require('it-last')

async function deploy () {
  const { IPFS_HOST, IPFS_PORT, IPFS_PROTO } = process.env

  const ipfs = create({
    port: IPFS_PORT || 5001,
    protocol: IPFS_PROTO || 'http',
    host: IPFS_HOST || 'localhost'
  })
  
  const options = { wrapWithDirectory: true, pin: true }
  const source = globSource('./out', '**/*')
  const last = await itlast(ipfs.addAll(source, options))
  
  if (last && last.cid) console.log(
    `website deployed to ${last.cid.toString()}`,
  )
}

deploy()
