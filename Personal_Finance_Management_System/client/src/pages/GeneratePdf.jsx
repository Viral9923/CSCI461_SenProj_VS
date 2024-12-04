import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "antd";
import moment from "moment";

const GeneratePdf = ({ transactions }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const user = JSON.parse(localStorage.getItem("user"));

    doc.setFontSize(20);
    doc.text("Budget Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`User: ${user.name}`, 20, 30);
    doc.text(`Date: ${moment().format("MM-DD-YYYY")}`, 20, 40);

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

    let incomeTotal = incomeTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    let expenseTotal = expenseTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    let savingsTotal = incomeTotal - expenseTotal;

    doc.text("Income Transactions", 20, 60);
    doc.autoTable({
      startY: 70,
      head: [["Date", "Amount", "Category", "Reference", "Description"]],
      body: incomeTransactions.map((t) => [
        moment(t.date).format("MM-DD-YYYY"),
        t.amount,
        t.category,
        t.reference,
        t.description,
      ]),
    });

    doc.text(
      `Total Income: ${incomeTotal}`,
      20,
      doc.autoTable.previous.finalY + 10
    );

    doc.text("Expense Transactions", 20, doc.autoTable.previous.finalY + 20);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 30,
      head: [["Date", "Amount", "Category", "Reference", "Description"]],
      body: expenseTransactions.map((t) => [
        moment(t.date).format("MM-DD-YYYY"),
        t.amount,
        t.category,
        t.reference,
        t.description,
      ]),
    });

    doc.text(
      `Total Expense: ${expenseTotal}`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `Total Savings: ${savingsTotal}`,
      20,
      doc.autoTable.previous.finalY + 20
    );

    doc.save("Transaction_Report.pdf");
  };

  return (
    <Button className="btn btn-primary" onClick={generatePDF}>
      Generate PDF
    </Button>
  );
};

export default GeneratePdf;
