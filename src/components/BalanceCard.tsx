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
          <div
            className="loader"
            style={{ width: 30, height: 30, margin: "auto" }}
          />
        ) : (
          <h2>{visible ? amount : "******"}</h2>
        )}
      </div>

      <div className="card-footer">
        {ActionIcon && <ActionIcon className="action-icon" />}
        <span>{actionText}</span>
      </div>
    </div>
  );
});
