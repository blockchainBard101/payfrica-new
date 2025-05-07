"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { FaEdit, FaSave, FaTimesCircle } from "react-icons/fa";
import { Navigation } from "@/components/Navigations";
import { nameExists } from "@/hooks/registerNsName";

interface UserPayload {
  address: string;
  username?: string;
  language: string;
  country?: { name: string };
  accountDetails?: {
    accountNumber: string;
    name: string;
    bank: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { address } = useCurrentAccount() ?? {};

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", countryName: "", language: "en" });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Bank editing
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({ bank: "", accountNumber: "", name: "" });

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  console.log(address);

  // Redirect guard and data fetch
  useEffect(() => {
    if (address === undefined) return;
    if (!address) {
      router.push("/login");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/users/${address}`);
        if (!res.ok) throw new Error(res.statusText);
        const u: UserPayload = await res.json();
        setUser(u);
        setProfileForm({
          username: u.username ?? "",
          countryName: u.country?.name ?? "",
          language: u.language,
        });
        if (u.accountDetails) setBankForm({ ...u.accountDetails });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [address, router, API]);

  // Username check only when creating username
  useEffect(() => {
    if (!editingProfile || !user || user.username) return;
    const name = profileForm.username.trim();
    if (name.length < 4) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    nameExists(name)
      .then((exists) => setUsernameAvailable(!exists))
      .catch(() => setUsernameAvailable(null))
      .finally(() => setCheckingUsername(false));
  }, [profileForm.username, editingProfile, user]);

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const saveProfile = async () => {
    if (!user) return;
    // Validate new username if none exists
    if (!user.username) {
      const name = profileForm.username.trim();
      if (name.length < 4 || checkingUsername || usernameAvailable === false) return;
    }
    try {
      const res = await fetch(`${API}/users/${address}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username ?? profileForm.username.trim(),
          countryName: profileForm.countryName,
          language: profileForm.language,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const updated: UserPayload = await res.json();
      setUser(updated);
      setEditingProfile(false);
      setUsernameAvailable(null);
    } catch (e: any) {
      console.error("Failed to save profile:", e.message);
    }
  };

  const saveBank = async () => {
    try {
      const res = await fetch(`${API}/users/${address}/account-details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankForm),
      });
      if (!res.ok) throw new Error(res.statusText);
      const updated: UserPayload = await res.json();
      setUser(updated);
      setEditingBank(false);
    } catch (e: any) {
      console.error("Failed to save account details:", e.message);
    }
  };

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  const hasUsername = Boolean(user.username && user.username.trim());
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
          <h2>Welcome, {user.username ?? user.address}</h2>
          <div className="date">{today}</div>
        </div>
      </header>

      <main className="main-content">
        <div className="profile-header">
          <button
            className="edit-btn"
            onClick={() => setEditingProfile((f) => !f)}
          >
            {editingProfile ? <FaTimesCircle /> : <FaEdit />} {editingProfile ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="two-column">
          <section className="column">
            <h2>Profile Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={onProfileChange}
                  disabled={!editingProfile || hasUsername}
                />
                {editingProfile && !hasUsername && (
                  <div>
                    {profileForm.username.trim().length < 4 ? (
                      <small>Please enter at least 4 characters</small>
                    ) : checkingUsername ? (
                      <small>Checking...</small>
                    ) : usernameAvailable === false ? (
                      <small style={{ color: 'red' }}>Taken</small>
                    ) : usernameAvailable === true ? (
                      <small style={{ color: 'green' }}>Available</small>
                    ) : null}
                  </div>
                )}
              </label>

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
                  disabled={
                    (!hasUsername && (profileForm.username.trim().length < 4 || checkingUsername || usernameAvailable === false))
                  }
                >
                  <FaSave /> Save Details
                </button>
              )}
            </form>
          </section>

          <section className="column">
            <h2>Withdrawal Account</h2>
            <button
              className="edit-btn"
              onClick={() => setEditingBank((f) => !f)}
            >
              {editingBank ? <FaTimesCircle /> : <FaEdit />} {editingBank ? "Cancel" : "Edit"}
            </button>

            {(!user.accountDetails && !editingBank) ? (
              <div className="empty-state">
                <p>You haven’t added withdrawal details yet.</p>
                <p><em>Click “Edit” above to enter bank details.</em></p>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                <label>
                  Bank Name
                  <input
                    type="text"
                    name="bank"
                    value={bankForm.bank}
                    onChange={onBankChange}
                    disabled={!editingBank}
                  />
                </label>

                <label>
                  Account Number
                  <input
                    type="text"
                    name="accountNumber"
                    value={bankForm.accountNumber}
                    onChange={onBankChange}
                    disabled={!editingBank}
                  />
                </label>

                <label>
                  Account Name
                  <input
                    type="text"
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
