// components/BalanceCard.tsx
"use client";

import React from "react";

interface Props {
  title: string;
  amount: string;
  loading: boolean;
  visible: boolean;
  actionText: string;
  ActionIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  ToggleIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  EllipsisIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onToggle(): void;
  onMore(): void;
  currencySymbol?: string;
}

export default React.memo(function BalanceCard({
  title,
  amount,
  loading,
  visible,
  actionText,
  ActionIcon,
  ToggleIcon,
  EllipsisIcon,
  onToggle,
  onMore,
  currencySymbol,
}: Props) {
  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <div className="balance-card-title-row">
          <span>{title}</span>
          <button className="eye-icon" onClick={onToggle} aria-label="toggle">
            <ToggleIcon />
          </button>
        </div>
      </div>

      <div className="card-amount">
        {loading ? (
          0
        ) : (
          <h2>
            {visible ? (
              <>
                {/* {currencySymbol } */}
                {/* {amount && !isNaN(Number(amount)) ? amount : "0"} */}
                {amount}
              </>
            ) : (
              "******"
            )}
          </h2>
        )}
      </div>

      <div className="card-footer">
        {ActionIcon && <ActionIcon className="action-icon" />}
        <span>{actionText}</span>
      </div>
    </div>
  );
});
