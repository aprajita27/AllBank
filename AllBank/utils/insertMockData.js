import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const insertMockData = async () => {
  const users = [
    {
      userId: "user1",
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "+11234567890",
        accountNumber: "123456789",
        routingNumber: "987654321",
        cardDetails: {
          cardNumber: "4111111111111111",
          cvv: "123",
          expiryDate: "12/25",
          nameOnCard: "John Doe",
          billingAddress: "123 Main Street, Springfield, USA"
        },
        accounts: {
          savings: {
            currentBalance: 8000,
            monthlyDeposit: 600,
            annualInterestRate: 0.03,
            savingsGoal: 20000
          },
          goals: [
            {
              goalName: "Vacation",
              targetAmount: 5000,
              savedAmount: 2000,
              startDate: "2024-01-01",
              endDate: "2024-12-31",
              motivation: "Dream trip to Paris",
              milestones: [
                { percentage: 25, achieved: true },
                { percentage: 50, achieved: false },
                { percentage: 75, achieved: false },
                { percentage: 100, achieved: false }
              ]
            },
            {
              goalName: "Emergency Fund",
              targetAmount: 10000,
              savedAmount: 6000,
              startDate: "2023-01-01",
              endDate: "2025-01-01",
              motivation: "For unforeseen expenses",
              milestones: [
                { percentage: 25, achieved: true },
                { percentage: 50, achieved: true },
                { percentage: 75, achieved: true },
                { percentage: 100, achieved: false }
              ]
            }
          ],
          investments: {
            funds: [
              {
                fundName: "Growth Fund",
                totalInvested: 7000,
                currentValue: 7800,
                lockInPeriod: "2025-03-01",
                redemptionPenalty: 0.02,
                liquidityType: "semi-liquid"
              },
              {
                fundName: "High-Yield Bond Fund",
                totalInvested: 5000,
                currentValue: 5200,
                lockInPeriod: "2024-06-01",
                redemptionPenalty: 0.01,
                liquidityType: "liquid"
              }
            ],
            simulations: [
              {
                strategy: "Aggressive Growth",
                projectedReturn: 9000,
                riskLevel: "High",
                liquidityBuffer: 1000,
                recommendation: "Increase monthly contribution by $200"
              },
              {
                strategy: "Balanced Portfolio",
                projectedReturn: 8000,
                riskLevel: "Moderate",
                liquidityBuffer: 2000,
                recommendation: "Maintain current strategy"
              }
            ]
          },
          loans: [
            {
              type: "Personal Loan",
              principalAmount: 5000,
              interestRate: 0.05,
              remainingTermMonths: 12,
              currentMonthlyPayment: 450,
              creditScore: 710
            },
            {
              type: "Student Loan",
              principalAmount: 20000,
              interestRate: 0.04,
              remainingTermMonths: 60,
              currentMonthlyPayment: 300,
              creditScore: 720
            }
          ],
          transactions: [
            {
              transactionId: "txn001",
              senderAccountNumber: "123456789",
              receiverAccountNumber: "987654321",
              type: "transfer",
              description: "Rent Payment",
              amount: 1000,
              timestamp: "2024-11-01T10:00:00Z"
            },
            {
              transactionId: "txn002",
              senderAccountNumber: "123456789",
              receiverAccountNumber: "321654987",
              type: "deposit",
              description: "Salary Credit",
              amount: 3000,
              timestamp: "2024-11-03T14:00:00Z"
            },
            {
              transactionId: "txn003",
              senderAccountNumber: "123456789",
              receiverAccountNumber: "654789123",
              type: "withdrawal",
              description: "ATM Cash Withdrawal",
              amount: 200,
              timestamp: "2024-11-05T18:00:00Z"
            }
          ]
        }
      }
    },
    {
      userId: "user2",
      data: {
        name: "Jane Smith",
        email: "janesmith@example.com",
        phoneNumber: "+11234567901",
        accountNumber: "987654321",
        routingNumber: "123456789",
        cardDetails: {
          cardNumber: "4222222222222222",
          cvv: "456",
          expiryDate: "11/26",
          nameOnCard: "Jane Smith",
          billingAddress: "456 Elm Street, Springfield, USA"
        },
        accounts: {
          savings: {
            currentBalance: 12000,
            monthlyDeposit: 700,
            annualInterestRate: 0.035,
            savingsGoal: 25000
          },
          goals: [
            {
              goalName: "Home Renovation",
              targetAmount: 20000,
              savedAmount: 8000,
              startDate: "2024-02-01",
              endDate: "2025-02-01",
              motivation: "Renovate living room and kitchen",
              milestones: [
                { percentage: 25, achieved: true },
                { percentage: 50, achieved: true },
                { percentage: 75, achieved: false },
                { percentage: 100, achieved: false }
              ]
            }
          ],
          investments: {
            funds: [
              {
                fundName: "Balanced Fund",
                totalInvested: 5000,
                currentValue: 5400,
                lockInPeriod: "2024-06-01",
                redemptionPenalty: 0.01,
                liquidityType: "liquid"
              },
              {
                fundName: "Real Estate Trust",
                totalInvested: 10000,
                currentValue: 11500,
                lockInPeriod: "2026-01-01",
                redemptionPenalty: 0.05,
                liquidityType: "illiquid"
              }
            ],
            simulations: [
              {
                strategy: "Conservative Growth",
                projectedReturn: 15000,
                riskLevel: "Low",
                liquidityBuffer: 5000,
                recommendation: "Invest $500 monthly in Real Estate Trust"
              }
            ]
          },
          loans: [
            {
              type: "Mortgage",
              principalAmount: 200000,
              interestRate: 0.035,
              remainingTermMonths: 240,
              currentMonthlyPayment: 1200,
              creditScore: 730
            }
          ],
          transactions: [
            {
              transactionId: "txn004",
              senderAccountNumber: "987654321",
              receiverAccountNumber: "123456789",
              type: "transfer",
              description: "Gift to John",
              amount: 300,
              timestamp: "2024-11-02T15:00:00Z"
            },
            {
              transactionId: "txn005",
              senderAccountNumber: "987654321",
              receiverAccountNumber: "111222333",
              type: "withdrawal",
              description: "ATM Cash Withdrawal",
              amount: 200,
              timestamp: "2024-11-04T12:00:00Z"
            }
          ]
        }
      }
    }
  ];

  try {
    for (const user of users) {
      const userRef = doc(db, "users", user.userId);
      await setDoc(userRef, user.data);
      console.log(`Mock data added for ${user.data.name}`);
    }
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }
};

export default insertMockData;
