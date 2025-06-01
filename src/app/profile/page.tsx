"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import { nameExists, createLeafSubname } from "@/hooks/registerNsName";
import Loading from "@/components/Loading";
import { useCustomCurrentAccount } from "@/hooks/useCustomCurrentAccount";
import { useCurrentAccount } from "@mysten/dapp-kit";

// Dynamic imports
const Navigation = dynamic(
  () => import("@/components/Navigations").then((m) => m.Navigation),
  { ssr: false }
);
const FaEdit = dynamic(() => import("react-icons/fa").then((m) => m.FaEdit), {
  ssr: false,
});
const FaSave = dynamic(() => import("react-icons/fa").then((m) => m.FaSave), {
  ssr: false,
});
const FaTimesCircle = dynamic(
  () => import("react-icons/fa").then((m) => m.FaTimesCircle),
  { ssr: false }
);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

function shortenAddress(addr: string): string {
  return addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
}

export default function ProfilePage() {
  const router = useRouter();
  const { address: wallet } = useCurrentAccount();
  const address = wallet;

  const {
    data: user,
    error,
    isValidating: loading,
  } = useSWR(address ? `${API}/users/${address}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  const hasUsername = Boolean(user?.username?.trim());

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: "",
    countryName: "",
    language: "en",
  });

  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank: "",
    accountNumber: "",
    name: "",
  });

  // Synchronize form state when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        countryName: user.country?.name || "",
        language: user.language || "en",
      });
      setBankForm({
        bank: user.accountDetails?.bank || "",
        accountNumber: user.accountDetails?.accountNumber || "",
        name: user.accountDetails?.name || "",
      });
    }
  }, [user]);

  const shouldCheck =
    editingProfile && !hasUsername && profileForm.username.trim().length >= 3;
  const { data: exists, isValidating: checkingUsername } = useSWR(
    shouldCheck ? ["username", profileForm.username] : null,
    (_, name) => nameExists(name)
  );
  const usernameAvailable = exists === false;

  // redirect in effect
  useEffect(() => {
    if (address === undefined) return;
    if (!address) router.push("/login");
  }, [address, router]);

  const onProfileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setProfileForm((f) => ({ ...f, [name]: value }));
    },
    []
  );

  const onBankChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankForm((f) => ({ ...f, [name]: value }));
  }, []);

  const saveProfile = useCallback(async () => {
    if (!address) return;
    const payload = {
      username: user?.username || profileForm.username.trim(),
      countryName: profileForm.countryName,
      language: profileForm.language,
    };
    console.log(profileForm.username.trim());
    if (usernameAvailable) {
      await createLeafSubname(profileForm.username.trim(), address);
    }
    await fetch(`${API}/users/${address}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await mutate(`${API}/users/${address}`);
    setEditingProfile(false);
  }, [address, profileForm, user, usernameAvailable]);

  const saveBank = useCallback(async () => {
    if (!address) return;
    await fetch(`${API}/users/${address}/account-details`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankForm),
    });
    await mutate(`${API}/users/${address}`);
    setEditingBank(false);
  }, [address, bankForm]);

  // loading / error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );
  }

  const displayName = user.username?.trim()
    ? user.username
    : shortenAddress(address!);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-page">
      <Navigation />
      <header className="top-bar">
        <div className="top-left">
          <h2>Welcome, {displayName}</h2>
          <div className="date">{today}</div>
        </div>
      </header>
      <main className="main-content">
        <div className="two-column">
          <section className="column">
            <button
              className="edit-btn"
              onClick={() => setEditingProfile((e) => !e)}
            >
              {editingProfile ? <FaTimesCircle /> : <FaEdit />}
              {editingProfile ? "Cancel" : "Edit"}
            </button>
            <h2>Profile Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Username
                <input
                  name="username"
                  value={profileForm.username}
                  onChange={onProfileChange}
                  disabled={!editingProfile || hasUsername}
                />
              </label>
              {editingProfile && !hasUsername && (
                <div>
                  {profileForm.username.trim().length < 4 ? (
                    <small>Please enter at least 3 characters</small>
                  ) : checkingUsername ? (
                    <small>Checking...</small>
                  ) : exists ? (
                    <small style={{ color: "red" }}>Taken</small>
                  ) : (
                    <small style={{ color: "green" }}>Available</small>
                  )}
                </div>
              )}
              <label>
                Country
                <select
                  name="countryName"
                  value={profileForm.countryName}
                  onChange={onProfileChange}
                  disabled={!editingProfile}
                >
                  <option value="">Select country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                </select>
              </label>
              <label>
                Language
                <select
                  name="language"
                  value={profileForm.language}
                  onChange={onProfileChange}
                  disabled={!editingProfile}
                >
                  <option value="en">English</option>
                </select>
              </label>
              {editingProfile && (
                <button
                  type="button"
                  className="save-btn"
                  onClick={saveProfile}
                  disabled={!usernameAvailable}
                >
                  <FaSave /> Save Details
                </button>
              )}
            </form>
          </section>
          <section className="column">
            <button
              className="edit-btn"
              onClick={() => setEditingBank((b) => !b)}
            >
              {editingBank ? <FaTimesCircle /> : <FaEdit />}
              {editingBank ? "Cancel" : "Edit"}
            </button>
            <h2>Withdrawal Account</h2>
            {!user.accountDetails && !editingBank ? (
              <div className="empty-state">
                <p>You haven&apos;t added withdrawal details yet.</p>
                <p>
                  <em>Click &quot;Edit&quot; above to enter bank details.</em>
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  Bank Name
                  <input
                    name="bank"
                    value={bankForm.bank}
                    onChange={onBankChange}
                    disabled={!editingBank}
                  />
                </label>
                <label>
                  Account Number
                  <input
                    name="accountNumber"
                    value={bankForm.accountNumber}
                    onChange={onBankChange}
                    disabled={!editingBank}
                  />
                </label>
                <label>
                  Account Name
                  <input
                    name="name"
                    value={bankForm.name}
                    onChange={onBankChange}
                    disabled={!editingBank}
                  />
                </label>
                {editingBank && (
                  <button type="button" className="save-btn" onClick={saveBank}>
                    <FaSave /> Save Account
                  </button>
                )}
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
