import Image from "next/image";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const savingsCircles = [
  {
    title: "WCA Contribution",
    amount: "₦3000",
    progress: 30,
    color: "#FF4D4D",
  },
  {
    title: "December Doings",
    amount: "₦45,000",
    progress: 70,
    color: "#007BFF",
  },
  {
    title: "Church Project",
    amount: "₦80,000",
    progress: 50,
    color: "#00CFFF",
  },
  { title: "New PC Geng", amount: "₦10,000", progress: 20, color: "#8B0000" },
  {
    title: "Bro Matt Wedding",
    amount: "₦30,000",
    progress: 45,
    color: "#FF4D4D",
  },
  { title: "Farm", amount: "₦25,000", progress: 60, color: "#FFA500" },
];

export const SavingsCircle = () => {
  return (
    <>
      {savingsCircles.length > 0 ? (
        <div className="savings-circle-container">
          <h2>Savings Circle</h2>
          <div className="savings-circles-wrapper">
            {savingsCircles.map((circle, index) => (
              <div key={index} className="savings-circle-card">
                <div className="savings-circle-card-header">
                  <span>{circle.title}</span>
                  <FaChevronRight />
                </div>
                <div className="card-amount">{circle.amount}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${circle.progress}%`,
                      backgroundColor: circle.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoSavings />
      )}
    </>
  );
};

const NoSavings = () => (
  <div className="no-savings-container">
    <div className="no-savings-content">
      {/* <Image
        src={"/No-savings-broken.jpg"}
        width={1000}
        height={100}
        alt="No savings"
      /> */}
      <h2>Coming Soon</h2>
      <p>
        We are working on this feature.
        <br />
        Please check back soon.
      </p>
      {/* <button className="create-savings-btn">Coming Soon</button> */}
    </div>
  </div>
);
