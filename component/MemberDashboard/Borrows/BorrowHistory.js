import React, { useEffect, useState } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  deleteBorrowAsync,
  fetchPerMemberBorrowAsync,
} from "@/store/slices/BorrowSlice";
import ReactDOM from "react-dom";
import CustomConfirm from "@/component/CustomComponent/CustomConfirm";
import ToastifyAlert from "@/component/CustomComponent/ToastifyAlert";
import { useFilterValue } from "@/component/Container";
import Pagination from "@/component/Pagination";
import SkeletonTable from "@/component/skeleton/SkeletonTable";

const BorrowHistory = ({ mid }) => {
  // Globel State Manegment
  const dispatch = useDispatch();
  const borrow = useSelector((state) => state.borrow.permemberborrow);
  const errormsg = useSelector((state) => state.error.error.msg);
  const errortype = useSelector((state) => state.error.error.type);

  // Filteration Code
  const filterValue = useFilterValue();
  // Remove the filter if the filter value is an empty string
  const filteredMembers = filterValue
    ? borrow.filter((e) => {
        const fullName = `${e.fname} ${e.mname} ${e.lname}`.toLowerCase();
        return (
          fullName.includes(filterValue.toLowerCase()) ||
          e.nickname.toLowerCase().includes(filterValue.toLowerCase())
        );
      })
    : borrow;

  // pagination
  const itemPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const startIndex = currentPage * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const rows = filteredMembers.slice(startIndex, endIndex);
  console.log("rows detailsss," ,rows);
  const numberOfPages = Math.ceil(filteredMembers.length / itemPerPage);
  const pageIndex = Array.from({ length: numberOfPages }, (_, idx) => idx + 1);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete Member
  const handleDelete = (id) => {
    ReactDOM.render(
      <CustomConfirm
        title="Delete Borrow"
        body={`Delete the Borrow from this table?`}
        button="Delete"
        onConfirm={async () => {
          try {
            dispatch(deleteBorrowAsync(id));
            ReactDOM.render(
              <ToastifyAlert type={errortype} message={errormsg} />,
              document.getElementById("CustomComponent")
            );
            await dispatch(fetchPerMemberBorrowAsync(mid));

            if (filteredMembers.length % itemPerPage == 1) {
              if (currentPage + 1 == numberOfPages) {
                setCurrentPage(currentPage - 1);
              }
            }
          } catch (error) {
            ReactDOM.render(
              <ToastifyAlert type={errortype} message={errormsg} />,
              document.getElementById("CustomComponent")
            );
          }
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
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchPerMemberBorrowAsync(mid));
    };
    fetchData();
  }, []);
  return (
    <>
      {/* Display Data */}

      <div className="bottom-data">
        <div className="orders">
          <div className="header">
            <i className="bx bx-receipt"></i>
            <h3>Borrow Payment History</h3>
            <i className="bx bx-filter"></i>
            <i className="bx bx-search"></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Date</th>
                <th>Collected By</th>
                <th>Bail Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            {rows.length > 0 ? (
              <tbody>
                {rows.map((e, i) => {
                  const parsedDate = e.date;
                  return (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>&#8377; {e.amount} </td>
                      <td>{e.note} </td>
                      <td>{parsedDate.toString().slice(0, 10)}</td>
                      <td>{e.given_by} </td>
                      <td>{`${e.bail_fname} ${e.bail_mname} ${e.bail_lname}`}</td>
                      <td>

                        
                        <Link
                          href={`/memberdashboard/borrows/editborrow?mid=${mid}&id=${e.id}&bid=${e.bail_m_id}&bid2=${e.bail_m_id2}`}
                        >
                          <BiMessageSquareEdit className="bx" />
                        </Link>
                      </td>

                      <td
                        onClick={() => {
                          handleDelete(e.id);
                        }}
                      >
                        <MdOutlineDeleteForever className="bx" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : borrow.length == 0 ? (
              <tbody><tr><td colSpan="7" style={{ paddingTop: "1em" }}>
                <div>
                  {" "}
                  {/* Wrap the content in a div */}
                  <div className="flex justify-center items-center">
                    <b className="text-red-500 m-8">
                      Borrow Payment Data Not found
                    </b>
                  </div>
                </div>
              </td></tr></tbody>
            ) : (
              <SkeletonTable numRows={4} numColumns={2} color="#FF5555" />
            )}
          </table>
          {/* pagination start */}
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={numberOfPages}
              onPageChange={handlePageChange}
            />
          </div>
          {/* pagination End */}
          <div id="CustomComponent"></div>
        </div>

        {/* End Display Data */}
      </div>
    </>
  );
};

export default BorrowHistory;
