import React, { useEffect, useState } from "react";
import styles from "@/styles/form.module.css";
import {
  editMemberAsync,
  fetchMemberAsync,
  fetchPerMemberAsync,
} from "@/store/slices/MemberSlice";
import { useDispatch, useSelector } from "react-redux";
import SkeletonForm from "../skeleton/SkeletonForm";
import ReactDOM from "react-dom";
import ToastifyAlert from "../CustomComponent/ToastifyAlert";
import { useRouter } from "next/router";

const UpdateMember = ({ id }) => {
  // globel State
  const router = useRouter();
  const dispatch = useDispatch();
  const members = useSelector((state) => state.member.member);
  const member = useSelector((state) => state.member.permember);
  const errormsg = useSelector((state) => state.error.error.msg);
  const errortype = useSelector((state) => state.error.error.type);

  // state
  const [validationError, setValidationError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // Track form validity
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [memberData, setMemberData] = useState({
    fname: "",
    mname: "",
    lname: "",
    nickname: "",
    mobileNo: "",
    altMobileNo: "",
    email: "",
    address: "",
    aadharNo: "",
    backAcNo: "",
    ifsc: "",
  });

  // Form Validataion
  useEffect(() => {
    // Check if all fields except altMobileNo are filled
    const {
      email,
      address,
      aadharNo,
      nickname,
      backAcNo,
      ifsc,
      altMobileNo,
      ...fieldsToCheck
    } = memberData;
    const allFieldsFilled = Object.values(fieldsToCheck).every(
      (value) => value !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [memberData, id]);

  // handle change input value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  // Save DAta
  const handleSubmit = (e) => {
    e.preventDefault();
    let username = localStorage.getItem("username");

    // Check if member already exists with the same name
    const memberExists = members.some(
      (m) =>
        // member.roll_no == rollno ||
        isFakeName ||
        memberData.mname == "" ||
        memberData.fname == "" ||
        memberData.lname == ""
    );

    // Check if member already exists with the same Number
    const NumberExists = members.some(
      (m) =>
        // member.roll_no == rollno ||
        isFakeNumber || memberData.mobileNo == ""
    );

    // Validate all fields
    if (isNaN(memberData.mobileNo) || memberData.mobileNo.length !== 10) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Enter Correct Mobile No.
        </div>
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (memberData.email != "") {
      if (!emailRegex.test(memberData.email)) {
        setValidationError(
          <div
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
            role="alert"
          >
            <span class="font-medium">Error !</span> Enter Correct Email.
          </div>
        );
        return;
      }
    }

    if (memberData.aadharNo != "") {
      if (isNaN(memberData.aadharNo) || memberData.aadharNo.length != 12) {
        setValidationError(
          <div
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
            role="alert"
          >
            <span class="font-medium">Error !</span> Enter Correct Aadhar No.
          </div>
        );
        return;
      }
    }

    // Process form data here
    setValidationError("");

    if (memberExists) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Member already exists. Please
          try again with a different name...
        </div>
      );
      return;
    } else if (NumberExists) {
      setValidationError(
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 "
          role="alert"
        >
          <span class="font-medium">Error !</span> Mobile Number Already
          Exist...
        </div>
      );
      return;
    } else {
      try {
        dispatch(editMemberAsync(id, { ...memberData, username }));
        ReactDOM.render(
          <ToastifyAlert type={errortype} message={errormsg} />,
          document.getElementById("CustomComponent")
        );
        setValidationError(
          <div
            class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
            role="alert"
          >
            <span class="font-medium">Success !</span> Member Updated
            Successfully.
          </div>
        );
        router.push("/memberlist");
      } catch (error) {
        ReactDOM.render(
          <ToastifyAlert type={errortype} message={errormsg} />,
          document.getElementById("CustomComponent")
        );
      }
    }
  };

  // check for unique name
  const [isFakeName, setisFakeName] = useState(false);

  // check FullName is Unique
  useEffect(() => {
    const memberExists = members.some(
      (m) =>
        m.id != member.id &&
        m.fname.toLowerCase() === memberData.fname.trim().toLowerCase() &&
        m.mname.toLowerCase() === memberData.mname.trim().toLowerCase() &&
        m.lname.toLowerCase() === memberData.lname.trim().toLowerCase()
    );
    setisFakeName(memberExists);
  }, [memberData.fname, memberData.lname, memberData.mname]);

  // check for unique Number
  const [isFakeNumber, setisFakeNumber] = useState(false);

  // check FullName is Unique
  useEffect(() => {
    const memberExists = members.some(
      (m) => m.id != member.id && m.mobile_no === memberData.mobileNo.trim()
    );
    setisFakeNumber(memberExists);
  }, [memberData.mobileNo]);

  // Fetch Data
  useEffect(() => {
    dispatch(fetchPerMemberAsync(id))
      .then((data) => {
        setMemberData({
          fname: data.fname,
          mname: data.mname,
          lname: data.lname,
          nickname: data.nickname,
          mobileNo: data.mobile_no,
          altMobileNo: data.alt_mobile_no,
          email: data.email,
          address: data.address,
          aadharNo: data.aadhar_card,
          backAcNo: data.bank_ac,
          ifsc: data.ifsc,
        });
        setIsDataFetch(true);
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(fetchMemberAsync());
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
              <h3>Edit {memberData.fullName}</h3>
            </div>
            <section className={styles.container}>
              {/* <header>Registration Form</header> */}
              <form action="#" className={styles.form}>
                <div className={styles.column}>
                  <div className={styles.input_box}>
                    <label htmlFor="fname">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      name="fname"
                      id="fname"
                      value={memberData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.input_box}>
                    <label htmlFor="mname">Middle Name</label>
                    <input
                      type="text"
                      max={10}
                      placeholder="Enter Middle Name"
                      name="mname"
                      id="mname"
                      value={memberData.mname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.input_box}>
                    <label htmlFor="lname">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      name="lname"
                      id="lname"
                      value={memberData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12 mt-3">
                    {memberData.fname != "" &&
                    memberData.mname != "" &&
                    memberData.lname != "" ? (
                      isFakeName ? (
                        <p
                          className=" text-white bg-red-500 p-1 "
                          style={{ borderRadius: 5 }}
                        >
                          <b>
                            {memberData.fname +
                              " " +
                              memberData.mname +
                              " " +
                              memberData.lname}
                          </b>{" "}
                          is already exist.
                        </p>
                      ) : (
                        <p
                          className=" text-white bg-green-500 p-1"
                          style={{ borderRadius: 5 }}
                        >
                          <b>
                            {memberData.fname +
                              " " +
                              memberData.mname +
                              " " +
                              memberData.lname}
                          </b>{" "}
                          not exist.
                        </p>
                      )
                    ) : null}
                  </div>
                </div>

                <div className={styles.input_box}>
                  <label htmlFor="nickname">Nick Name</label>
                  <input
                    type="text"
                    placeholder="Enter Nick Name"
                    name="nickname"
                    id="nickname"
                    value={memberData.nickname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.column}>
                  <div className={styles.input_box}>
                    <label htmlFor="mobileNo">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      name="mobileNo"
                      id="mobileNo"
                      value={memberData.mobileNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.input_box}>
                    <label htmlFor="altMobileNo">Alter Phone Number</label>
                    <input
                      type="text"
                      max={10}
                      placeholder="Enter phone number"
                      name="altMobileNo"
                      id="altMobileNo"
                      value={memberData.altMobileNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.input_box}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      placeholder="Enter email address"
                      name="email"
                      id="email"
                      value={memberData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 mt-3">
                    {memberData.mobileNo != "" ? (
                      isFakeNumber ? (
                        <p
                          className=" text-white bg-red-500 p-1 "
                          style={{ borderRadius: 5 }}
                        >
                          <b>{memberData.mobileNo}</b> is already exist.
                        </p>
                      ) : (
                        <p
                          className=" text-white bg-green-500 p-1"
                          style={{ borderRadius: 5 }}
                        >
                          <b>{memberData.mobileNo}</b> not exist.
                        </p>
                      )
                    ) : null}
                  </div>
                </div>

                <div className={`${styles.input_box} ${styles.address}`}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    placeholder="Enter street address"
                    name="address"
                    id="address"
                    value={memberData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={`${styles.input_box} ${styles.address}`}>
                  <label htmlFor="aadharNo">Aadhar Card Number</label>
                  <input
                    type="text"
                    placeholder="Enter aadhar card number"
                    name="aadharNo"
                    id="aadharNo"
                    value={memberData.aadharNo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.column}>
                  <div className={styles.input_box}>
                    <label htmlFor="backAcNo">Bank Account Number</label>
                    <input
                      type="text"
                      placeholder="Enter Bank Account Number"
                      name="backAcNo"
                      id="backAcNo"
                      value={memberData.backAcNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.input_box}>
                    <label htmlFor="ifsc">IFSC Code</label>
                    <input
                      type="text"
                      id="ifsc"
                      placeholder="Enter IFSC Code"
                      name="ifsc"
                      value={memberData.ifsc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {validationError && (
                  <p className="text-red-600 mt-5">{validationError}</p>
                )}

                <button
                  className={`${isFormValid ? "" : "disable-btn"}`}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
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

export default UpdateMember;
