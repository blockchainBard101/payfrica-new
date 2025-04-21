// src/components/ConfirmConvertOverlay.jsx
'use client'

import React, { useState } from 'react'
import { useGlobalState } from '@/GlobalStateProvider'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { useConverter } from '@/hooks/convert'

export default function ConfirmConvertOverlay() {
  const {
    overlayStates,
    toggleOverlay,
    closeAllOverlays,
    convertData
  } = useGlobalState()
  const { handleConvert } = useConverter()
  const [loading, setLoading] = useState(false)

  // only render when confirmConvert is open and we have data
  if (!overlayStates.confirmConvert || !convertData) return null

  const { fromToken, toToken, fromAmount, toAmount } = convertData

  const onConfirm = async () => {
    setLoading(true)
    try {
      await handleConvert(fromToken, toToken, parseFloat(fromAmount))
      setLoading(false)
      // close this overlay, then open success
      toggleOverlay('confirmConvert')
      toggleOverlay('success')
    } catch (error) {
      console.error(error)
      setLoading(false)
      // close this overlay, then open failed
      toggleOverlay('confirmConvert')
      toggleOverlay('failed')
    }
  }

  return (
    <div className="overlay-background">
      <div className="confirm-convert-overlay">
        <div className="modal-header">
          <IoIosCloseCircleOutline
            className="close-btn"
            onClick={() => toggleOverlay('confirmConvert')}
          />
        </div>

        <h4>You are converting</h4>
        <h2>
          {fromAmount} {fromToken} &rarr; {toAmount} {toToken}
        </h2>
        <p>Your Payfrica wallet will receive:</p>

        <div className="convert-summary">
          <div>
            <span>You receive</span>
            <strong>
              {toAmount} {toToken}
            </strong>
          </div>
          <div>
            <span>Fee</span>
            <strong>NGN 0.00</strong>
          </div>
          <div>
            <span>Payment method</span>
            <strong>Payfrica Bridge</strong>
          </div>
        </div>

        <button
          className="convert-btn"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Converting…' : 'Convert'}
        </button>
      </div>
    </div>
  )
}
