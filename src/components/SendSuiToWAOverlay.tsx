'use client';
import { useState, useEffect } from 'react';
import { LuMoveLeft } from 'react-icons/lu';
import { BsQrCodeScan } from 'react-icons/bs';
import { useGlobalState } from '../GlobalStateProvider';
import { ProfileDP } from '@/imports';
import { nameExists, getNsAddress } from '@/hooks/registerNsName';
import { useSendCoinNs, useSendCoinAdd } from '@/hooks/send';
import { useCustomWallet } from '@/contexts/CustomWallet';
import { getTokenBalance } from '@/hooks/getCoinBalance';
import Image from 'next/image';

const SendSuiToWAOverlay = () => {
  const { overlayStates, toggleOverlay } = useGlobalState();
  const isVisible = overlayStates.sendSuiToWA;

  const { address: myAddress } = useCustomWallet();
  const sendCoinNs = useSendCoinNs();
  const sendCoinAdd = useSendCoinAdd();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [token, setToken] = useState<"NGNC" | "GHSC">("NGNC");
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBal, setLoadingBal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [nsValid, setNsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!myAddress) {
      setBalance(null);
      return;
    }

    setLoadingBal(true);
    getTokenBalance(myAddress, token)
      .then(bal => setBalance(Number(bal)))
      .catch(() => setBalance(null))
      .finally(() => setLoadingBal(false));
  }, [myAddress, token]);

  useEffect(() => {
    if (recipient.includes('@')) {
      nameExists(recipient).then(exists => setNsValid(exists));
    } else {
      setNsValid(null);
    }
  }, [recipient]);

  const handleSend = async () => {
    if (!amount || !recipient) return;
    if (recipient.includes('@') && !nsValid) return;

    setIsSending(true);
    let rawAddr = recipient;

    if (recipient.includes('@')) {
      rawAddr = await getNsAddress(recipient);
    }

    try {
      const success = recipient.includes('@')
        ? await sendCoinNs(token, Number(amount), recipient)
        : await sendCoinAdd(token, Number(amount), rawAddr);

      toggleOverlay('sendSuiToWA');
      toggleOverlay(success ? 'sending' : 'failed');
    } catch {
      toggleOverlay('sendSuiToWA');
      toggleOverlay('failed');
    } finally {
      setIsSending(false);
    }
  };

  const canSend = !!amount && !!recipient && !isSending && (recipient.includes('@') ? nsValid === true : true);

  return (
    <div
    className="overlay-background"
    style={{
      display: isVisible ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    }}
  >
      <div className="enter-amount-overlay">
        <div className="overlay-header">
          <LuMoveLeft
            className="back-icon"
            onClick={() => {
              toggleOverlay('sendSuiToken');
              toggleOverlay('sendSuiToWA');
            }}
          />
          <BsQrCodeScan className="qrcodeicon" />
        </div>

        <div className="recipient-info">
          <Image src={ProfileDP} alt="Profile Picture" className="profile-picture" width={40} height={40} />
          <div>
            <h3>Team Sushi</h3>
            <p>@teamsushi</p>
          </div>
        </div>

        <div className="amount-entry">
          <h3>Enter Amount & Token</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                fontFamily: 'InterLight',
                fontSize: '16px',
                border: '1px solid #ccc',
                outline: 'none',
              }}
            />
            <select
              value={token}
              onChange={e => setToken(e.target.value as "NGNC" | "GHSC")}
              style={{
                marginLeft: '8px',
                padding: '10px',
                borderRadius: '5px',
                fontFamily: 'InterLight',
                fontSize: '16px',
                border: '1px solid #ccc',
                outline: 'none',
              }}
            >
              <option value="NGNC">NGNC</option>
              <option value="GHSC">GHSC</option>
            </select>
            <button
              onClick={() => balance !== null && setAmount(balance.toString())}
              disabled={loadingBal || balance === null}
              style={{
                marginLeft: '8px',
                padding: '10px 12px',
                borderRadius: '5px',
                fontFamily: 'InterLight',
                fontSize: '16px',
                border: '1px solid #ccc',
                background: 'white',
                cursor: loadingBal || balance === null ? 'not-allowed' : 'pointer',
                opacity: loadingBal || balance === null ? 0.5 : 1,
              }}
            >
              Max
            </button>
          </div>

          <div style={{ marginBottom: 16, fontFamily: 'InterLight', fontSize: '14px', color: '#333' }}>
            {loadingBal ? 'Loading balance…' : `Balance: ${balance ?? '0'} ${token}`}
          </div>

          <div className="amount-options" style={{ marginBottom: 20 }}>
            {['1', '5', '10', '50'].map(a => (
              <button key={a} onClick={() => setAmount(a)} style={{ marginRight: 8 }}>
                {a}
              </button>
            ))}
          </div>

          <h3>Recipient (Address or NS)</h3>
          <input
            type="text"
            placeholder="e.g. 0x… or alice@payfrica"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              fontFamily: 'InterLight',
              fontSize: '16px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          {recipient.includes('@') && nsValid === false && (
            <small style={{ color: 'red', fontFamily: 'InterLight' }}>
              Payfrica name does not exist
            </small>
          )}
        </div>

        <button
          className="send-money-button"
          onClick={handleSend}
          disabled={!canSend}
          style={{
            opacity: canSend ? 1 : 0.5,
            cursor: canSend ? 'pointer' : 'not-allowed',
            marginTop: '15px',
          }}
        >
          {isSending ? 'Sending…' : 'Send Token'}
        </button>
      </div>
    </div>
  );
};

export default SendSuiToWAOverlay;
