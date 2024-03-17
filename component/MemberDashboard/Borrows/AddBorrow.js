import React, { useEffect, useState } from "react";
import styles from "@/styles/form.module.css";
import {
  fetchMemberAsync,
  fetchPerMemberAsync,
} from "@/store/slices/MemberSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategoryAsync } from "@/store/slices/CategorySlice";
import { addBorrowAsync } from "@/store/slices/BorrowSlice";
import ReactDOM from "react-dom";
import ToastifyAlert from "@/component/CustomComponent/ToastifyAlert";
import CofirmAfterAdd from "@/component/CustomComponent/CofirmAfterAdd";
import { useRouter } from "next/router";

const AddBorrow = ({ mid }) => {
  // Globel State Manegment
  const router = useRouter();
  const dispatch = useDispatch();
  const member = useSelector((state) => state.member.member);
  const permember = useSelector((state) => state.member.permember);
  const errormsg = useSelector((state) => state.error.error.msg);
  const errortype = useSelector((state) => state.error.error.type);

  // state
  const [validationError, setValidationError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // Track form validity
  let username = "";
  if (typeof window !== "undefined") {
    // Check if window is defined (client-side)
    username = localStorage.getItem("username");
  }

  const [PaymentData, setPaymentData] = useState({
    amount: "",
    collectedby: username,
    date: new Date().toISOString().substr(0, 10),
    note: "",
    mid: mid,
    bailmid: "",
    bailmid2: "",
  });

  // handle change input value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...PaymentData, [name]: value });
  };
  // handle change input value

  // Form Validataion
  useEffect(() => {
    // Check if all fields except altMobileNo are filled
    const { note, bailmid2, ...fieldsToCheck } = PaymentData;
    const allFieldsFilled = Object.values(fieldsToCheck).every(
      (value) => value !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [PaymentData]);

  // Save DAta
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields

    if (isNaN(PaymentData.amount)) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Amount Accept Only Digit
          Number...
        </div>
      );
      return;
    }

    if (PaymentData.amount <= 0) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Amount Should be Grether Than
          0...
        </div>
      );
      return;
    }

    if (
      PaymentData.mid == PaymentData.bailmid ||
      PaymentData.mid == PaymentData.bailmid2
    ) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Member Can Not Be Own Bail...
        </div>
      );
      return;
    }

    // Process form data here
    setValidationError("");

    try {
      dispatch(addBorrowAsync({ ...PaymentData, username }));

      ReactDOM.render(
        <CofirmAfterAdd
          title="Borrow Payment Added Successfully"
          body={`dou you want to add New Borrow Payment ?`}
          btn1="No"
          btn2="Yes"
          onConfirm={() => {
            setValidationError(
              <div
                class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                role="alert"
              >
                <span class="font-medium">Success !</span> Borrow Payment Added
                Successfully.
              </div>
            );
            setPaymentData({
              amount: "",
              collectedby: "",
              date: new Date().toISOString().substr(0, 10),
              note: "",
              bailmid: "",
              bailmid2: "",
              mid: mid,
            });
            setBailInputValue1("");
            setBailInputValue2("");
          }}
          onback={async () => {
            router.push(`/memberdashboard/borrows/${mid}`);
          }}
          onClose={() => {
            // if once click cancel button so, Close the modal
            // Close the modal using ReactDOM.unmountComponentAtNode

            ReactDOM.unmountComponentAtNode(
              document.getElementById("CustomComponent")
            );
          }}
        />,
        document.getElementById("CustomComponent") // root element
      );
    } catch (error) {
      console.log(error);
      ReactDOM.render(
        <ToastifyAlert type={errortype} message={errormsg} />,
        document.getElementById("CustomComponent")
      );
    }
  };

  // Auto Complete Field For Member

  const sortedNames = [...member].sort((a, b) =>
    a.fname.localeCompare(b.fname)
  );

  // Auto Complete Field For Bail

  const [bailInputValue1, setBailInputValue1] = useState("");
  const [bailInputValue2, setBailInputValue2] = useState("");
  const [suggestedBail1Names, setSuggestedBail1Names] = useState([]);
  const [suggestedBail2Names, setSuggestedBail2Names] = useState([]);

  const handleChangeBail1AutoComplete = (event) => {
    const value = event.target.value;
    setBailInputValue1(value);

    const bailSuggestions = sortedNames.filter((m) => {
      const fullName = `${m.fname} ${m.mname} ${m.lname}`.toLowerCase();
      return fullName.includes(value.toLowerCase()) || m.id == value;
    });
    setSuggestedBail1Names(bailSuggestions);
    setPaymentData((prevData) => ({ ...prevData, bailmid: "" }));
  };

  const handleChangeBail2AutoComplete = (event) => {
    const value = event.target.value;
    setBailInputValue2(value);

    const bailSuggestions = sortedNames.filter((m) => {
      const fullName = `${m.fname} ${m.mname} ${m.lname}`.toLowerCase();
      return fullName.includes(value.toLowerCase()) || m.id == value;
    });
    setSuggestedBail2Names(bailSuggestions);
    setPaymentData((prevData) => ({ ...prevData, bailmid2: "" }));
  };

  const handleBail1NameClick = (name, value) => {
    setBailInputValue1(name);
    setPaymentData((prevData) => ({ ...prevData, bailmid: value }));
    setSuggestedBail1Names([]);
  };

  const handleBail2NameClick = (name, value) => {
    setBailInputValue2(name);
    setPaymentData((prevData) => ({ ...prevData, bailmid2: value }));
    setSuggestedBail2Names([]);
  };

  useEffect(() => {
    dispatch(fetchPerMemberAsync(mid));
    dispatch(fetchMemberAsync());
    dispatch(fetchCategoryAsync());
  }, []);

  return (
    <>
      {/* Add Data */}
      <div className="bottom-data">
        <div className="orders">
          <div className="header">
            <i className="bx bx-receipt"></i>
            <h3>Add New Payment</h3>
            <h5> Member Id = {mid}</h5>
          </div>
          <section className={styles.container}>
            {/* <header>Registration Form</header> */}
            <form action="#" className={styles.form}>
              <div className={styles.input_box}>
                <label htmlFor="fullName">
                  Select Member <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  name="fullName"
                  id="fullName"
                  className="cursor-not-allowed"
                  value={`${permember.fname} ${permember.mname} ${permember.lname}`}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>

              <div className={styles.column}>
                <div className={styles.input_box}>
                  <label htmlFor="amount">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    name="amount"
                    id="amount"
                    value={PaymentData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.input_box}>
                  <label htmlFor="collectedby">
                    Collected By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter collectedby address"
                    name="collectedby"
                    id="collectedby"
                    value={PaymentData.collectedby}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.input_box}>
                  <label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    placeholder="Enter Date"
                    name="date"
                    id="date"
                    value={PaymentData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.input_box}>
                  <label htmlFor="note">Note </label>
                  <input
                    type="text"
                    placeholder="Enter Note"
                    name="note"
                    id="note"
                    value={PaymentData.note}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.input_box}>
                  <label htmlFor="bailname">
                    Select Bail Member - 1{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    name="bailname"
                    id="bailname"
                    value={bailInputValue1}
                    onChange={handleChangeBail1AutoComplete}
                    autoComplete="off"
                    required
                  />
                  <ul className="autocompletelist">
                    {suggestedBail1Names.slice(0, 5).map((e, index) => (
                      <li
                        key={index}
                        className="autocomplete-list-items"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleBail1NameClick(
                            e.fname + " " + e.mname + " " + e.lname,
                            e.id
                          )
                        }
                      >
                        <b>
                          <span className="mr-2">{e.id}</span>
                          {`${e.fname} ${e.mname} ${e.lname}`}
                        </b>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.input_box}>
                  <label htmlFor="bailname">Select Bail Member - 2</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    name="bailname"
                    id="bailname"
                    value={bailInputValue2}
                    onChange={handleChangeBail2AutoComplete}
                    autoComplete="off"
                  />
                  <ul className="autocompletelist">
                    {suggestedBail2Names.slice(0, 5).map((e, index) => (
                      <li
                        key={index}
                        className="autocomplete-list-items"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleBail2NameClick(
                            e.fname + " " + e.mname + " " + e.lname,
                            e.id
                          )
                        }
                      >
                        <b>
                          <span className="mr-2">{e.id}</span>
                          {`${e.fname} ${e.mname} ${e.lname}`}
                        </b>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {validationError && (
                <p className="text-red-600 mt-5">{validationError}</p>
              )}

              <button
                className={`${isFormValid ? "" : "disable-btn"}`}
                disabled={!isFormValid}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </section>
          <div id="CustomComponent"></div>
        </div>
      </div>
      {/* End Add Data */}
    </>
  );
};

export default AddBorrow;
