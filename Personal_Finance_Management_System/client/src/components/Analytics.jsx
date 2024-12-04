import React from "react";
import { Progress } from "antd";

const Analytics = ({ allTransaction }) => {
  const categories = [
    "salary", "bonus", "business", "socialsec", "retirement", "investment",
    "rent", "medical", "groceries", "entertainment", "insurance", "wellness"
  ];

  // Totals
  const ttlTransaction = allTransaction.length;
  const ttlIncomeTransactions = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const ttlExpenseTransactions = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const ttlIncomePercent =
    (ttlIncomeTransactions.length / ttlTransaction) * 100;
  const ttlExpensePercent =
    (ttlExpenseTransactions.length / ttlTransaction) * 100;

  // Turnovers
  const ttlTurnOver = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const ttlIncomeTurnOver = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const ttlExpenseTurnOver = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const ttlIncomeTurnOverPercent = (ttlIncomeTurnOver / ttlTurnOver) * 100;
  const ttlExpenseTurnOverPercent = (ttlExpenseTurnOver / ttlTurnOver) * 100;

  return (
    <>
      <h2 className="analytics-title">Analytics</h2>
      <div className="row m-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              Total Transactions : {ttlTransaction}
            </div>
            <div className="card-body">
              <h5 className="text-success">
                Income: {ttlIncomeTransactions.length}
              </h5>
              <h5 className="text-danger">
                Expense: {ttlExpenseTransactions.length}
              </h5>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={ttlIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2"
                  percent={ttlExpensePercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <h4>Categorywise Income</h4>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / ttlIncomeTurnOver) * 100).toFixed(0)}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-4">
          <h4>Categorywise Expense</h4>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5>{category}</h5>
                    <Progress
                      percent={((amount / ttlExpenseTurnOver) * 100).toFixed(0)}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total Turnover : {ttlTurnOver}</div>
            <div className="card-body">
              <h5 className="text-success">
                Income Turnover: {ttlIncomeTurnOver}
              </h5>
              <h5 className="text-danger">
                Expense Turnover {ttlExpenseTurnOver}
              </h5>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={ttlIncomeTurnOverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2"
                  percent={ttlExpenseTurnOverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
