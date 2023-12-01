import Container from "@/component/Container";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBorrowDipositeAsync } from "@/store/slices/MemberBorrowDepositeSlice";
import { fetchBorrowAsync } from "@/store/slices/BorrowSlice";
import { fetchReturnPaymentAsync } from "@/store/slices/ReturnPaymentSlice";
import { fetchPaymentAsync } from "@/store/slices/PaymentSlice";
import jsPDF from "jspdf";

export default function Home() {
  const dispatch = useDispatch();

  // get total funds
  const totalfunds = useSelector((state) => state.payment.payment);

  // get total return payment
  const totalreturnpayment = useSelector(
    (state) => state.returnpayment.returnpayment
  );

  // get total borrow payment
  const totalborrow = useSelector((state) => state.borrow.borrow);

  // get total borrow deposite payment
  const totalborrowdeposite = useSelector(
    (state) => state.borrowdeposite.borrowdeposite
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchPaymentAsync());
      dispatch(fetchReturnPaymentAsync());
      dispatch(fetchBorrowAsync());
      dispatch(fetchBorrowDipositeAsync());
    };
    fetchData();
  }, []);

  // total borrow
  const [totalBorrowAmount, setTotalBorrowAmount] = useState(0);
  useEffect(() => {
    if (totalborrow && totalborrow.length > 0) {
      const calculatedTotalAmount = totalborrow.reduce(
        (sum, record) => sum + record.amount,
        0
      );
      setTotalBorrowAmount(calculatedTotalAmount);
    }
  }, [totalborrow]);

  // total borrow deposite
  const [totalBorrowDepositeAmount, setTotalBorrowDepositeAmount] = useState(0);
  useEffect(() => {
    if (totalborrowdeposite && totalborrowdeposite.length > 0) {
      const calculatedTotalAmount = totalborrowdeposite.reduce(
        (sum, record) => sum + record.amount,
        0
      );
      setTotalBorrowDepositeAmount(calculatedTotalAmount);
    }
  }, [totalborrowdeposite]);

  // download the cash-flow payment history
  const handleDownload = () => {
    const pdf = new jsPDF();

    // Set title
    pdf.setFontSize(18);
    pdf.text("Cash Flow Total History", 75, 15);

    // Set current date and time
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    pdf.setFontSize(12);
    pdf.text(`Date: ${currentDate}   Time: ${currentTime}`, 72, 25);

    // Set up table options
    const tableOptions = {
      startY: 40,
      margin: { top: 10 },
      head: [
        { title: "Total Borrowed", dataKey: totalBorrowAmount },
        { title: "Total Deposited", dataKey: totalBorrowDepositeAmount },
        { title: "Total Borrowed Due", dataKey: totalBorrowedDue },
        { title: "Total Funds", dataKey: totalFundsAmount },
        { title: "Total Returned", dataKey: totalReturnAmount },
        { title: "Total Payable Refund", dataKey: totalPayableRefund },
      ],
      theme: "striped",
      headStyles: { fontSize: 12, fillColor: ["#1976D2"] },
      styles: { fontSize: 10, cellPadding: 4 },
    };

    // Add table to the PDF
    pdf.autoTable(tableOptions);

    // Save the PDF
    pdf.save("cash-flow_total_history.pdf");
  };

  // category wise show payment history
  const categories = useSelector((state) => state.category.category);
  const [isFilterVisibleFunds, setIsFilterVisibleFunds] = useState(false);

  const [selectedCategoriesFunds, setSelectedCategoriesFunds] = useState([
    "All",
  ]);

  // Handle category change for funds (for multiple categories)
  const handleCategoryChangeFunds = (category) => {
    if (category === "All") {
      setSelectedCategoriesFunds(["All"]);
    } else {
      const updatedCategories = selectedCategoriesFunds.includes(category)
        ? selectedCategoriesFunds.filter(
            (selectedCategory) => selectedCategory !== category
          )
        : [...selectedCategoriesFunds.filter((cat) => cat !== "All"), category];
      setSelectedCategoriesFunds(updatedCategories);
    }
  };

  // calculate the total payment for category wise
  const calculateTotalPaymentForCategory = (payments) => {
    const filteredPayments = payments.filter((payment) => {
      return (
        selectedCategoriesFunds.includes("All") ||
        selectedCategoriesFunds.includes(payment.c_id)
      );
    });

    if (selectedCategoriesFunds.includes("All")) {
      return payments.reduce((total, payment) => total + payment.amount, 0);
    } else if (filteredPayments.length > 0) {
      return filteredPayments.reduce(
        (total, payment) => total + payment.amount,
        0
      );
    } else {
      return 0;
    }
  };

  // total funds
  const [totalFundsAmount, setTotalFundsAmount] = useState(0);
  useEffect(() => {
    if (totalfunds && totalfunds.length > 0) {
      const calculatedTotalAmount =
        calculateTotalPaymentForCategory(totalfunds);
      setTotalFundsAmount(calculatedTotalAmount);
    }
  }, [totalfunds, selectedCategoriesFunds]);

  // total return payment
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  useEffect(() => {
    if (totalreturnpayment && totalreturnpayment.length > 0) {
      const calculatedTotalReturnAmount =
        calculateTotalPaymentForCategory(totalreturnpayment);
      setTotalReturnAmount(calculatedTotalReturnAmount);
    }
  }, [totalreturnpayment, selectedCategoriesFunds]);

  let totalBorrowedDue = totalBorrowAmount - totalBorrowDepositeAmount; // total borrowed due payment
  let totalPayableRefund = totalFundsAmount - totalReturnAmount; // total payable refund payment

  return (
    <>
      <Container>
        <div className="header">
          <div className="left">
            <h1>Dashboard</h1>
            <ul className="breadcrumb">
              <li>
                <a href="#">Analytics</a>
              </li>
              /
              <li>
                <a href="#" className="active">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <a href="#" className="report" onClick={handleDownload}>
            <i className="bx bx-cloud-download"></i>
            <span>Download Payment Slip</span>
          </a>
        </div>
        {/* Insights  */}
        <ul className="insights">
          <li>
            <i className="bx bx-calendar-check"></i>
            <span className="info">
              <h3>Borrowed</h3>
              <p>{totalBorrowAmount}</p>
            </span>
          </li>
          <li>
            <i className="bx bx-show-alt"></i>
            <span className="info">
              <h3>Deposited</h3>
              <p>{totalBorrowDepositeAmount}</p>
            </span>
          </li>
          <li>
            <i className="bx bx-filter"></i>
            <span className="info">
              <h3>Borrowed Due</h3>

              <p style={{ color: totalBorrowedDue < 0 ? "red" : "green" }}>
                {totalBorrowedDue}
              </p>
            </span>
          </li>

          {/* Funds */}
          <li>
            <i
              className="bx bx-filter"
              onClick={() => setIsFilterVisibleFunds(!isFilterVisibleFunds)}
            ></i>
            <span className="info">
              <h3>Funds</h3>
              <p>{totalFundsAmount}</p>
            </span>
          </li>

          <li>
            <i className="bx bx-dollar-circle"></i>
            <span className="info">
              <h3>Returned</h3>
              <p>{totalReturnAmount}</p>
            </span>
          </li>
          <li>
            <i className="bx bx-dollar-circle"></i>
            <span className="info">
              <h3>Payable Refund</h3>
              <p>{totalPayableRefund}</p>
            </span>
          </li>
        </ul>
        {/* End of Insights  */}
        category by filter
        <div className={`filter ${isFilterVisibleFunds ? "visible" : ""}`}>
          <label htmlFor="category">Filter by Category:</label>
          <div>
            <input
              type="checkbox"
              id="allCategories"
              value="All"
              checked={selectedCategoriesFunds.includes("All")}
              onChange={() => handleCategoryChangeFunds("All")}
            />
            <label htmlFor="allCategories">All</label>
          </div>
          {categories.map((category, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={category.id}
                value={category.id}
                checked={selectedCategoriesFunds.includes(category.id)}
                onChange={() => handleCategoryChangeFunds(category.id)}
              />
              <label htmlFor={category.id}>{category.name}</label>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
