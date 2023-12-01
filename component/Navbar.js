import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Navbar = ({ onFilterChange }) => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    onFilterChange(e.target.value); // Notify parent component about filter change
  };

  const handleMobileSearchToggle = () => {
    const searchForm = document.querySelector("nav form");
    const searchBtnIcon = document.querySelector(
      "nav form .form-input button .bx"
    );

    if (window.innerWidth < 576) {
      searchForm.classList.toggle("show");
      searchBtnIcon.classList.toggle("bx-search");
      searchBtnIcon.classList.toggle("bx-x");
    }
  };

  const handleThemeToggle = (e) => {
    if (e.target.checked) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };
  const handleProfileClick = (e) => {
    e.preventDefault(); // Prevents the default link behavior
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleDocumentClick = (e) => {
    // Close the dropdown if clicked outside the profile area
    if (!e.target.closest(".profile")) {
      setIsDropdownVisible(false);
    }
  };

  // logout code
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("username");
    router.push("/login");
  };

  useEffect(() => {
    // Add a click event listener to the document to close the dropdown
    document.addEventListener("click", handleDocumentClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <>
      {/* Navbar  */}
      <nav>
        <i className="bx bx-menu"></i>
        <form>
          <div className="form-input">
            <input
              type="search"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <i className="bx bx-search"></i>
            </button>
          </div>
        </form>

        <input
          type="checkbox"
          id="theme-toggle"
          hidden
          onChange={handleThemeToggle}
        />
        <label htmlFor="theme-toggle" className="theme-toggle"></label>

        <a href="#" className="profile">
          <img
            src="/images/logo.png"
            alt="Profile"
            onClick={handleProfileClick}
          />
          {isDropdownVisible && (
            <div className="dropdown">
              {/* Dropdown content goes here */}
              <ul>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </a>
      </nav>

      {/* End of Navbar  */}
    </>
  );
};

export default Navbar;
