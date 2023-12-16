import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMemberAsync,
  fetchPerMemberAsync,
} from "@/store/slices/MemberSlice";
import { totalborrowdepositeAsync } from "@/store/slices/MemberBorrowDepositeSlice";
import { totalborrowpaymentAsync } from "@/store/slices/BorrowSlice";
import { totalreturnpaymentAsync } from "@/store/slices/ReturnPaymentSlice";
import { totalpaymentAsync } from "@/store/slices/PaymentSlice";
import InitialsAvatar from "../utilities/InitialsAvatar";
import { fetchAccountingDetailAsync } from "@/store/slices/Accounting";
import Pagination from "../Pagination";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoImage from "../../public/images/sahara.jpeg";
import { fetchCategoryAsync } from "@/store/slices/CategorySlice";

const Dashboard = ({ memberId }) => {
  const totalreturnpayment = useSelector(
    (state) => state.returnpayment.totalreturnpayment
  );
  const totalpayment = useSelector((state) => state.payment.totalpayment);
  const totalfunds = useSelector((state) => state.payment.totalfunds);
  const account = useSelector((state) => state.account.account);

  let totalborrowdeposite = useSelector(
    (state) => state.borrowdeposite.totalborrowdepositepayment
  );
  let totalborrow = useSelector((state) => state.borrow.totalborrowpayment);

  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State for filter
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [NetProfit, setNetProfit] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  let netPayment = 0;
  let netPaymentForReport = 0;
  let totalBorrowedDue = totalborrowdeposite - totalborrow;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchPerMemberAsync(memberId));
      dispatch(totalborrowdepositeAsync(memberId));
      dispatch(totalborrowpaymentAsync(memberId));
      dispatch(totalreturnpaymentAsync(memberId));
      dispatch(totalpaymentAsync(memberId));
      dispatch(fetchCategoryAsync());

      dispatch(fetchAccountingDetailAsync(memberId));
    };
    fetchData();
  }, []);

  // const categories = Array.from(new Set(account.map((e) => e.cat_name)));
  const categories = useSelector((state) => state.category.category);
  const [selectedCategoryFunds, setSelectedCategoryFunds] = useState("All");
  const [isFilterVisibleFunds, setIsFilterVisibleFunds] = useState(false);

  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(true);

  // Function to calculate total payment for a category
  let totalPayableRefund = 0;

  const calculateTotalPaymentForCategory = (category) => {
    let totalFunds = 0;
    let totalReturnPayment = 0;

    if (category === "All") {
      // Calculate total funds and total return payment for all categories
      account.forEach((payment) => {
        if (payment.table_name === "Fund Payment") {
          totalFunds += payment.amount;
        } else if (payment.table_name === "Refund Payment") {
          totalReturnPayment += payment.amount;
        }
      });
    } else {
      // Calculate total funds and total return payment for the selected category
      account.forEach((payment) => {
        if (
          payment.table_name === "Fund Payment" &&
          payment.cat_name === category
        ) {
          totalFunds += payment.amount;
        } else if (
          payment.table_name === "Refund Payment" &&
          payment.cat_name === category
        ) {
          totalReturnPayment += payment.amount;
        }
      });
    }
    totalPayableRefund = totalFunds - totalReturnPayment;
    return { totalFunds, totalReturnPayment, totalPayableRefund };
  };

  const handleCategoryChangeFunds = (category) => {
    setSelectedCategoryFunds(category);
  };

  const handleFilterIconClickFunds = () => {
    setIsFilterVisibleFunds(!isFilterVisibleFunds); // Toggle the filter visibility
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterIconClick = () => {
    setIsFilterVisible(!isFilterVisible); // Toggle the filter visibility
  };

  // Filtered data based on selected category
  // const filteredAccount = account.filter((e) => {
  //   if (selectedCategory == "0") {
  //     return true;
  //   } else if (selectedCategory == "1") {
  //     return e.table_name == "Fund Payment";
  //   } else if (selectedCategory == "2") {
  //     return e.table_name == "Refund Payment";
  //   } else if (selectedCategory == "3") {
  //     return e.table_name == "Borrow Payment";
  //   } else if (selectedCategory == "4") {
  //     return e.table_name == "RePay Payment";
  //   }
  // });

  const filteredAccount = account.filter((e) => {
    if (
      showAllCategories ||
      selectedCategories.length === 0 ||
      selectedCategories.includes(e.cat_name)
    ) {
      if (
        selectedCategory === "0" ||
        (selectedCategory === "1" && e.table_name === "Fund Payment")
      ) {
        return true;
      } else if (
        selectedCategory === "2" &&
        (e.table_name === "Borrow Payment" || e.table_name === "RePay Payment")
      ) {
        return true;
      }
    }
    return false;
  });

  // Handle category checkbox change
  const handleCategoryCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle checkbox to show all categories
  const handleShowAllCategoriesChange = () => {
    setShowAllCategories(!showAllCategories);
    setSelectedCategories([]); // Reset selected categories
  };

  useEffect(() => {
    // Calculate total credit and total debit here (excluding "Lillah" category)
    let creditTotal = 0;
    let debitTotal = 0;

    filteredAccount.forEach((e) => {
      if (e.type == 1) {
        // Check if the category is not "Lillah" before adding to creditTotal
        // if (e.cat_name != "lillah") {
        creditTotal += e.amount;
        // }
      } else {
        // Check if the category is not "Lillah" before adding to debitTotal
        // if (e.cat_name != "lillah") {
        debitTotal += e.amount;
        // }
      }
    });

    setTotalCredit(creditTotal);
    setTotalDebit(debitTotal);
    setNetProfit(creditTotal - debitTotal);
  }, [filteredAccount]); // Update totals when filteredAccount changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = filteredAccount.slice(startIndex, endIndex);

  const categoryLabels = {
    0: "All Ledger",
    1: "Fund Ledger",
    2: "Borrow Ledger",
  };

  const calculateNetPaymentForReport = (paymentType, amount, category) => {
    if (paymentType === "Fund Payment" || paymentType === "RePay Payment") {
      netPaymentForReport = netPaymentForReport + amount;
    } else if (paymentType === "Refund Payment") {
      netPaymentForReport = netPaymentForReport - amount;
    } else if (paymentType === "Borrow Payment") {
      netPaymentForReport = netPaymentForReport - amount;
    }

    // If the category is "lillah," always consider it as credit
    // if (category === "lillah") {
    //   netPayment = Math.abs(netPayment);
    // }

    return netPaymentForReport;
  };

  const calculateNetPayment = (paymentType, amount, category) => {
    if (paymentType === "Fund Payment" || paymentType === "RePay Payment") {
      netPayment = netPayment + amount;
    } else if (paymentType === "Refund Payment") {
      netPayment = netPayment - amount;
    } else if (paymentType === "Borrow Payment") {
      netPayment = netPayment - amount;
    }

    // If the category is "lillah," always consider it as credit
    // if (category === "lillah") {
    //   netPayment = Math.abs(netPayment);
    // }

    return netPayment;
  };

  const memberData = useSelector((state) => state.member.permember);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPerMemberAsync(memberId));
    };

    fetchData(); // Call the async function to fetch data
  }, []);

  // download slip code

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Handle the logic based on the selected option
    if (selectedValue === "PDF") {
      handleDownloadPdfButtonClick();
    } else if (selectedValue === "Excel") {
      handleDownloadExcelButtonClick();
    }
  };

  const handleDownloadExcelButtonClick = () => {
    console.log(filteredAccount);
    let creditTotal = 0;
    let debitTotal = 0;

    filteredAccount.forEach((e) => {
      if (e.type == 1) {
        creditTotal += e.amount;
      } else {
        debitTotal += e.amount;
      }
    });

    setTotalCredit(creditTotal);
    setTotalDebit(debitTotal);
    setNetProfit(creditTotal - debitTotal);

    const memberName = `${memberData.fname} ${memberData.mname} ${memberData.lname}`;

    const csvContent =
      `Member Name,${memberName}\n` +
      "Transaction ID,Payment Type,Category,Collected By,Collected User,Date,Credit,Debit,Net\n" +
      filteredAccount
        .map((e) => {
          const netPayment = calculateNetPaymentForReport(
            e.table_name,
            e.amount,
            e.cat_name
          );
          return `${e.id},${e.table_name},${e.cat_name},${e.collected_by},${
            e.collected_user
          },${e.date},${e.type == 1 ? e.amount : ""},${
            e.type != 1 ? e.amount : ""
          },${netPayment}`;
        })
        .join("\n") +
      `\n,,,,,Total,${creditTotal},${debitTotal},${NetProfit}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `ledger_${memberId}_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdfButtonClick = () => {
    let creditTotal = 0;
    let debitTotal = 0;

    filteredAccount.forEach((e) => {
      if (e.type == 1) {
        creditTotal += e.amount;
      } else {
        debitTotal += e.amount;
      }
    });

    setTotalCredit(creditTotal);
    setTotalDebit(debitTotal);
    setNetProfit(creditTotal - debitTotal);

    const memberName = `${memberData.fname} ${memberData.mname} ${memberData.lname}`;

    // Initialize jsPDF
    const pdf = new jsPDF();

    // Ensure logoImage contains Base64 data
    const imgData = logoImage.src; // without add src imgData type is object

    // Check if imgData is a string
    if (typeof imgData === "string") {
      // Add image to the PDF
      pdf.addImage(imgData, "JPEG", 10, 10, 40, 40);

      // Set company information
      pdf.setFontSize(16);
      pdf.text("SAHARA EDUCATION AND WELFARE TRUST", 60, 20);
      pdf.setFontSize(14);
      pdf.text("At/Po-Majadar Ta-vadgam Di-Banaskantha Pin-385210", 60, 27);
      pdf.text("REGD NO. F/6710 B.K.", 90, 34);

      // Set current date and time
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      pdf.setFontSize(12);
      pdf.text(`Date: ${currentDate}   Time: ${currentTime}`, 80, 40);

      // Add member name to the PDF
      pdf.text(`Member Name: ${memberName}`, 15, 60);

      // Add table header
      const tableColumn = [
        "Transaction ID",
        "Payment Type",
        "Category",
        "Collected By",
        "Collected User",
        "Date",
        "Credit",
        "Debit",
        "Net",
      ];

      const tableRows = filteredAccount.map((e) => {
        const netPayment = calculateNetPaymentForReport(
          e.table_name,
          e.amount,
          e.cat_name
        );
        return [
          e.id,
          e.table_name,
          e.cat_name,
          e.collected_by,
          e.collected_user,
          e.date,
          e.type == 1 ? e.amount : "",
          e.type != 1 ? e.amount : "",
          netPayment,
        ];
      });

      pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
      });

      // Add total credit and total debit
      pdf.text(
        `Total Credit: ${totalCredit}`,
        10,
        pdf.autoTable.previous.finalY + 10,
        { fontSize: 8 }
      );
      pdf.text(
        `Total Debit: ${totalDebit}`,
        10,
        pdf.autoTable.previous.finalY + 20,
        { fontSize: 8 }
      );

      // Add net profit
      pdf.text(
        `Net Profit: ${NetProfit}`,
        10,
        pdf.autoTable.previous.finalY + 30,
        { fontSize: 8 }
      );

      // Save the PDF
      pdf.save(`ledger_${memberId}_${new Date().toISOString()}.pdf`);
    } else {
      console.error("Invalid image data");
    }
  };

  // handle showing entry code

  const [entriesOptions] = useState([25, 50, 75, 100]);

  const handleEntriesChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0); // Reset to the first page when changing entries per page
  };

  return (
    <>
      <div className="header">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="#">Member Details</a>
            </li>
            /
            <li>
              <a href="#" className="active">
                Member Dashboard
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <div style={{ textAlign: "center", fontWeight: 500 }}>
            Export Ledger Slip
          </div>
          <select
            style={{ width: "200px", marginTop: "10px" }}
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="" selected>
              Select an option
            </option>
            <option onClick={handleDownloadPdfButtonClick}>PDF</option>
            <option onClick={handleDownloadExcelButtonClick}>Excel</option>
          </select>
        </div>
        {/* <a href="#" className="report">
          <i className="bx bx-cloud-download"></i>
          <span>Download Member Slip</span>
          <i
            class="bx bx-dots-vertical-rounded"
            onClick={handleDropdownIconClick}
          ></i>
        </a> */}
        {/* <a href="#" className="report" onClick={handleDownloadPdfButtonClick}>
          <i className="bx bx-cloud-download"></i>
          <span>Download Member Slip</span>
        </a> */}
      </div>

      {/* Insights  */}
      <ul className="insights">
        <li>
          <i className="bx bx-calendar-check"></i>
          <span className="info">
            <h3>Borrowed</h3>
            <p>{totalborrow}</p>
          </span>
        </li>
        <li>
          <i className="bx bx-show-alt"></i>
          <span className="info">
            <h3>Deposited</h3>
            <p>{totalborrowdeposite}</p>
          </span>
        </li>
        {/* <li>
          <i className="bx bx-filter"></i>
          <span className="info">
            <h3>Funds</h3>
            <p>{totalpayment}</p>
          </span>
        </li> */}
        <li>
          <i className="bx bx-filter"></i>
          <span className="info">
            <h3>Borrowed Due</h3>

            <p style={{ color: totalBorrowedDue < 0 ? "red" : "green" }}>
              {totalBorrowedDue}
            </p>
          </span>
        </li>

        <div></div>

        {/* Funds */}
        <li>
          <i className="bx bx-filter" onClick={handleFilterIconClickFunds}></i>
          <span className="info">
            <h3>Funds</h3>
            <p>
              {
                calculateTotalPaymentForCategory(selectedCategoryFunds)
                  .totalFunds
              }
            </p>
          </span>
        </li>

        {/* Return Payment */}
        <li>
          <i className="bx bx-dollar-circle"></i>
          <span className="info">
            <h3>Return Payment</h3>
            <p>
              {
                calculateTotalPaymentForCategory(selectedCategoryFunds)
                  .totalReturnPayment
              }
            </p>
          </span>
        </li>

        <li>
          <i className="bx bx-dollar-circle"></i>
          <span className="info">
            <h3>Payable Refund</h3>
            <p>{totalPayableRefund}</p>
          </span>
        </li>

        {/* Filter */}
        <div className={`filter ${isFilterVisibleFunds ? "visible" : ""}`}>
          <div>
            <label htmlFor="category">Filter by Funds:</label>
            {/* Example dropdown */}
            <select onChange={(e) => handleCategoryChangeFunds(e.target.value)}>
              <option value="All">All</option>
              {/* Render other category options dynamically from Redux state */}
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ul>
      {/* End of Insights  */}

      {/* Filter */}
      <div className={`filter ${isFilterVisible ? "visible" : ""}`}>
        <div style={{ display: "flex" }}>
          <label htmlFor="category" style={{ paddingTop: 5 }}>
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="0">All Payment</option>
            <option value="1">Fund</option>
            <option value="2">Borrow</option>
          </select>

          {/* Filter by Category Checkboxes */}
          <div
            className="category-checkboxes"
            style={{ marginTop: 5, marginLeft: 20 }}
          >
            <input
              type="checkbox"
              checked={showAllCategories}
              onChange={handleShowAllCategoriesChange}
            />
            <label style={{ paddingLeft: 5 }}>All</label>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <input
                  type="checkbox"
                  value={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryCheckboxChange(category.name)}
                />
                <label style={{ paddingLeft: 5 }}>{category.name}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div class="bottom-data">
        <div class="orders">
          <div className="header">
            <i className="bx bx-receipt"></i>
            <h3>{categoryLabels[selectedCategory]}</h3>
            {/* Dropdown for entries per page */}
            <div className="entries-dropdown">
              <label htmlFor="entries">Show entries:</label>
              <select
                id="entries"
                value={itemsPerPage}
                onChange={(e) => handleEntriesChange(Number(e.target.value))}
              >
                {entriesOptions.map((option) => (
                  <option key={option} value={option}>
                    {`Show ${option}`}
                  </option>
                ))}
              </select>
            </div>
            <i
              className={`bx bx-filter ${isFilterVisible ? "active" : ""}`}
              onClick={handleFilterIconClick}
            ></i>
            <i className="bx bx-search"></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Payment Type</th>
                <th>Category</th>
                <th>Collected By</th>
                <th>Collected User</th>
                <th>Date</th>

                <th>Credit</th>
                <th>Debit</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((e, i) => {
                let netPayment = calculateNetPayment(
                  e.table_name,
                  e.amount,
                  e.cat_name
                );
                return (
                  <tr>
                    <td>{e.id}</td>
                    <td>{e.table_name}</td>
                    <td>{e.cat_name}</td>
                    <td>{e.collected_by}</td>
                    <td>{e.collected_user}</td>
                    <td>{e.date}</td>

                    {e.type == 1 ? (
                      <>
                        <td style={{ color: "green" }}>{e.amount}</td>
                        <td style={{ color: "red" }}>-</td>
                        <td style={{ color: netPayment < 0 ? "red" : "green" }}>
                          {netPayment}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ color: "green" }}>-</td>
                        <td style={{ color: "red" }}>{e.amount}</td>
                        <td style={{ color: netPayment < 0 ? "red" : "green" }}>
                          {netPayment}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              <tr className="border-t-2 mt-4 border-gray-300">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Credit / Debit</td>
                <td style={{ color: "green" }}>{totalCredit}</td>
                <td style={{ color: "red" }}>{totalDebit}</td>
              </tr>

              <tr className="border-t-2 mt-4 border-gray-300">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Net</td>

                {NetProfit > 0 ? (
                  <>
                    <td style={{ color: "green" }}>{NetProfit}</td>
                    <td>-</td>
                  </>
                ) : (
                  <>
                    <td>-</td>
                    <td style={{ color: "red" }}>{NetProfit}</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredAccount.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />

          {/* <div class="header">
            <i class="bx bx-receipt"></i>
            <h3>Member Details</h3>
          </div>
          {memberData ? (
            <div>
              <h1>Member Dashboard for Member ID: {memberData.id}</h1>
              <p>
                Name:{" "}
                {`${memberData.fname} ${memberData.mname} ${memberData.lname}`}
              </p>
              <p>Address: {memberData.address}</p>
              <p>Number: {memberData.mobile_no}</p>
              <p>Email: {memberData.email}</p>
            </div>
          ) : (
            <p>Loading member data...{memberId}</p>
          )} */}
        </div>

        {/* End Display Data */}
      </div>
    </>
  );
};

export default Dashboard;
