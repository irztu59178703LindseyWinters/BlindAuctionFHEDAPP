import React, { useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config/contracts'
import { IS_DEMO } from './config/app'
import { encryptBid } from './services/fhe.service'

declare global {
  interface Window { ethereum?: any }
}

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string>("")
  const [auctionId, setAuctionId] = useState<number>(0)
  const [item, setItem] = useState('')
  const [reserve, setReserve] = useState('0')
  const [period, setPeriod] = useState('300')
  const [bidEth, setBidEth] = useState('0.01')

  const ensureSepolia = async (eth: any) => {
    try {
      const chainId = await eth.request({ method: 'eth_chainId' })
      if (chainId !== '0xaa36a7') {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }]
        })
      }
    } catch (e) {
      // ignore if user rejects or chain not added
      console.warn('chain switch skipped:', e)
    }
  }

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert('No injected wallet detected. Please install MetaMask.')
        return
      }
      await ensureSepolia(window.ethereum)
      const p = new ethers.BrowserProvider(window.ethereum)
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const s = await p.getSigner()
      setProvider(p)
      setSigner(s)
      setAccount(accounts[0])
    } catch (err: any) {
      console.error('connect error', err)
      alert(`Connect failed: ${err?.message || err}`)
    }
  }

  const getContract = () => {
    if (!signer) throw new Error('Connect wallet')
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }

  const handleCreate = async () => {
    try {
      const c = getContract()
      const tx = await c.createAuction(item, ethers.parseEther(reserve), Number(period))
      const r = await tx.wait()
      console.log('created', r)
      alert('Auction created. Note the latest id from contract state.')
    } catch (e: any) {
      alert(`Create failed: ${e?.message || e}`)
    }
  }

  const handleBid = async () => {
    try {
      const c = getContract()
      if (IS_DEMO) {
        const tx = await c.placeBidMock(auctionId, { value: ethers.parseEther(bidEth) })
        await tx.wait()
        alert('Mock bid sent')
      } else {
        const { externalEuint32, proof } = await encryptBid(Number(ethers.parseEther(bidEth)))
        const tx = await c.placeBidEncrypted(auctionId, externalEuint32, proof)
        await tx.wait()
        alert('Encrypted bid sent')
      }
    } catch (e: any) {
      alert(`Bid failed: ${e?.message || e}`)
    }
  }

  const handleFinalize = async () => {
    try {
      const c = getContract()
      const tx = await c.finalize(auctionId)
      await tx.wait()
      alert('Finalized')
    } catch (e: any) {
      alert(`Finalize failed: ${e?.message || e}`)
    }
  }

  const handleWithdraw = async () => {
    try {
      const c = getContract()
      const tx = await c.withdraw()
      await tx.wait()
      alert('Withdrawn (if any)')
    } catch (e: any) {
      alert(`Withdraw failed: ${e?.message || e}`)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Blind Auction (FHE Demo)</h1>
      <div className="card stack">
        <div className="row">
          <button className="btn" onClick={connect}>{account ? `${account.slice(0,6)}...${account.slice(-4)}` : 'Connect Wallet'}</button>
        </div>

        <div className="section-title">Create Auction</div>
        <div className="row">
          <input className="input" placeholder='Item' value={item} onChange={e=>setItem(e.target.value)} />
          <input className="input" placeholder='Reserve (ETH)' value={reserve} onChange={e=>setReserve(e.target.value)} />
          <input className="input" placeholder='Period (sec)' value={period} onChange={e=>setPeriod(e.target.value)} />
          <button className="btn" onClick={handleCreate}>Create</button>
        </div>

        <div className="section-title">Bid</div>
        <div className="row">
          <input className="input" placeholder='Auction ID' type='number' value={auctionId} onChange={e=>setAuctionId(Number(e.target.value))} />
          <input className="input" placeholder='Bid (ETH)' value={bidEth} onChange={e=>setBidEth(e.target.value)} />
          <button className="btn" onClick={handleBid}>{IS_DEMO ? 'Place Mock Bid' : 'Place Encrypted Bid'}</button>
        </div>

        <div className="section-title">Finalize & Withdraw</div>
        <div className="row">
          <button className="btn" onClick={handleFinalize}>Finalize</button>
          <button className="btn" onClick={handleWithdraw}>Withdraw</button>
        </div>
      </div>
    </div>
  )
}

export default App
