"use client";
import { Navigation } from "@/components/Navigations";
import { useState, useEffect } from "react";
import ProfileDP from "../../../public/ProfileDP.jpg";
import {
  FaSearch,
  FaBell,
  FaEdit,
  FaSave,
  FaTimesCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import Image from "next/image";

const ProfilePage = () => {
  // mimic loaded user
  const [userName, setUserName] = useState({
    username: "4our 0ero 4our",
    email: "alexarawles@gmail.com",
    tag: "alexarawles@payfrica",
    tagCreated: "22nd May, 2024",
  });

  // form state
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    country: "",
    timezone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  // load saved profile/details
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pfProfile") || "{}");
    setForm((f) => ({ ...f, ...saved }));
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handleSave = () => {
    localStorage.setItem("pfProfile", JSON.stringify(form));
    setIsEditing(false);
  };

  // today's date
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-page">
      <Navigation />
      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-left">
          <h2>Welcome, {userName.username}</h2>
          <div className="date">{today}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile Header */}
        <div className="profile-header">
          {/* <div className="profile-details">
            <h3>{user.username}</h3>
          </div> */}
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <FaTimesCircle /> : <FaEdit />}{" "}
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="two-column">
          {/* Left Column: User Details */}
          <section className="column">
            <h2>Profile Details</h2>
            <form className="details-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                Username
                <input
                  name="username"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <small style={{ color: "red", fontFamily: "InterLight" }}>
                  *Payfrica tag exixts*
                </small>
              </label>
              <label>
                Country
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select country</option>
                  <option value="NGNC">Nigeria</option>
                  <option value="GHSC">Ghana</option>
                  <option value="KHSC">Kenya</option>
                </select>
              </label>
              <label>
                Language
                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select a language</option>
                  <option value="English">English</option>
                </select>
              </label>
              {isEditing && (
                <button type="button" className="save-btn" onClick={handleSave}>
                  <FaSave /> Save Details
                </button>
              )}
            </form>
          </section>

          {/* Right Column: Withdrawal Account */}
          {/* --- RIGHT: Withdrawal Account Details --- */}
          <section className="column">
            <div className="section-header">
              <h2>Withdrawal Account</h2>
            </div>

            {isEditing ? (
              /* 1) Edit mode: always show inputs */
              <form
                className="details-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <label>
                  Bank Name
                  <input
                    name="bankName"
                    placeholder="Bank Name"
                    value={form.bankName}
                    onChange={handleChange}
                    disabled={false}
                  />
                </label>

                <label>
                  Account Number
                  <input
                    name="accountNumber"
                    placeholder="Account Number"
                    value={form.accountNumber}
                    onChange={handleChange}
                    disabled={false}
                  />
                </label>

                <label>
                  Account Name
                  <input
                    name="accountName"
                    placeholder="Account Name"
                    value={form.accountName}
                    onChange={handleChange}
                    disabled={false}
                  />
                </label>

                <button type="button" className="save-btn" onClick={handleSave}>
                  <FaSave /> Save Account
                </button>
              </form>
            ) : (
              (() => {
                const hasAccount =
                  form.bankName && form.accountNumber && form.accountName;

                return hasAccount ? (
                  /* 2) Read-only view if they’ve already saved details */
                  <form
                    className="details-form"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label>
                      Bank Name
                      <input name="bankName" value={form.bankName} disabled />
                    </label>

                    <label>
                      Account Number
                      <input
                        name="accountNumber"
                        value={form.accountNumber}
                        disabled
                      />
                    </label>

                    <label>
                      Account Name
                      <input
                        name="accountName"
                        value={form.accountName}
                        disabled
                      />
                    </label>
                  </form>
                ) : (
                  /* 3) Empty state if no details yet */
                  <div className="empty-state">
                    <p>You haven’t added withdrawal details yet.</p>
                    <p>
                      <em>
                        Click “Edit” above to enter bank name, account number &
                        account name.
                      </em>
                    </p>
                  </div>
                );
              })()
            )}
          </section>
        </div>
        {/* Payfrica Tag Block
        <div className="tag-block">
          <h4>My Payfrica Tag</h4>
          <div className="tag-row">
            <FaRegUserCircle className="tag-icon" />
            <span className="tag-text">{user.tag}</span>
            <FaEdit className="tag-edit" />
          </div>
          <div className="tag-note">
            This can only be edited once
            <br />
            Created {user.tagCreated}
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default ProfilePage;
