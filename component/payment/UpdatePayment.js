import React, { useEffect, useState } from "react";
import styles from "@/styles/form.module.css";
import {
  editMemberAsync,
  fetchPerMemberAsync,
} from "@/store/slices/MemberSlice";
import { useDispatch, useSelector } from "react-redux";
import SkeletonForm from "../skeleton/SkeletonForm";
import {
  editPaymentAsync,
  fetchPerPaymentAsync,
} from "@/store/slices/PaymentSlice";
import { fetchCategoryAsync } from "@/store/slices/CategorySlice";
import ReactDOM from "react-dom";
import ToastifyAlert from "../CustomComponent/ToastifyAlert";

const UpdatePayment = ({ mid, id }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.category);
  const errormsg = useSelector((state) => state.error.error.msg);
  const errortype = useSelector((state) => state.error.error.type);

  // state
  const [validationError, setValidationError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // Track form validity
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [PaymentData, setPaymentData] = useState({
    amount: "",
    collectedby: "",
    mid: "",
    cid: "",
  });

  // Form Validataion
  useEffect(() => {
    // Check if all fields except altMobileNo are filled
    const allFieldsFilled = Object.values(PaymentData).every(
      (value) => value !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [PaymentData, id]);

  // handle change input value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...PaymentData, [name]: value });
  };

  // Save DAta
  const handleSubmit = async (e) => {
    e.preventDefault();
    let username = localStorage.getItem("username");
    // Validate all fields

    if (isNaN(PaymentData.amount)) {
      setValidationError(`Amount Accept Only Digit Number`);
      return;
    }

    // Process form data here
    setValidationError("");
    // setPaymentData({ ...PaymentData, username })

    try {
      await dispatch(editPaymentAsync(id, { ...PaymentData, username }));
      ReactDOM.render(
        <ToastifyAlert type={errortype} message={errormsg} />,
        document.getElementById("CustomComponent")
      );
    } catch (error) {
      ReactDOM.render(
        <ToastifyAlert type={errortype} message={errormsg} />,
        document.getElementById("CustomComponent")
      );
    }
  };

  // Fetch Data
  useEffect(() => {
    dispatch(fetchCategoryAsync());
    dispatch(fetchPerPaymentAsync(id))
      .then((data) => {
        setPaymentData({
          amount: data.amount,
          collectedby: data.collected_by,
          mid: data.m_id,
          cid: data.c_id,
        });

        dispatch(fetchPerMemberAsync(data.m_id))
          .then((data) => {
            setInputValue(data.fname + " " + data.mname + " " + data.lname);
            setIsDataFetch(true);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <>
      {/* Update Data */}
      {!isDataFetch ? (
        <SkeletonForm />
      ) : (
        <div className="bottom-data">
          <div className="orders">
            <div className="header">
              <i className="bx bx-receipt"></i>
              <h3>Edit Payment</h3>
            </div>
            <section className={styles.container}>
              {/* <header>Registration Form</header> */}
              <form action="#" className={styles.form}>
                <div className={styles.input_box}>
                  <label htmlFor="fullName">Member Info</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    name="fullName"
                    id="fullName"
                    value={inputValue}
                    autoComplete="off"
                    disabled
                    required
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                </div>

                <div className={styles.column}>
                  <div className={styles.input_box}>
                    <label htmlFor="amount">Amount</label>
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
                    <label htmlFor="collectedby">Collected By</label>
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
                <div className={styles.input_box}>
                  <label className="mt-10">Select Category</label>
                  <div className={styles.select_box}>
                    <select
                      name="cid"
                      onChange={handleChange}
                      value={PaymentData.cid}
                    >
                      <option value={0}>Null</option>
                      {categories.map((e, i) => {
                        return (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {validationError && (
                  <p className="text-red-600 mt-5">* {validationError}</p>
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
      )}
      {/* End Update Data */}
    </>
  );
};

export default UpdatePayment;
