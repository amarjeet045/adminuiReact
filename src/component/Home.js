import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function Home() {
  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  function handleEdit(e) {
    console.log(e.target.getAttribute("id"));
    console.log(data);
    console.log("edit button is clicked");
  }
  function handleDelete(e) {
    console.log(e.target.getAttribute("id"));
    console.log("delete button");
  }
  function searchFunction() {
    var input, filter;
    input = document.getElementById("myInput");
    filter = input.value.toLowerCase();
    setSearchInput(filter);
    if (searchInput !== "") {
      const filterData = data.filter((doc) => {
        return Object.values(doc).join("").toLowerCase().includes(filter);
      });
      setFilteredResults(filterData);
    } else {
      setFilteredResults(data);
    }
  }
  useEffect(() => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setData(response);
        // setCommitHistory(response.items);
        // setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);
  const perPageRecord = 10;
  const totalRecords = data.length;
  console.log(totalRecords);
  console.log(filteredResults.length);
  const currentPage = 1;
  const numberOfPage = Math.ceil(totalRecords / perPageRecord);
  const pagesVisited = pageNum * perPageRecord;
  let rec;
  if (totalRecords === filteredResults.length) {
    rec = data;
  } else if (filteredResults.length > 0) {
    rec = filteredResults;
  } else {
    rec = data;
  }

  const displayData = rec
    .slice(pagesVisited, pagesVisited + perPageRecord)
    .map((doc) => {
      return (
        <>
          <tr key={doc.id}>
            <td>
              <input type="checkbox" />
            </td>
            <td>{doc.name}</td>
            <td>{doc.email}</td>
            <td>{doc.role}</td>
            <td style={{ display: "flex", gap: "20px" }}>
              <Button
                id={doc.id}
                onClick={handleEdit}
                style={{ marginLeft: "10px" }}
              >
                edit
              </Button>
              <Button id={doc.id} onClick={handleDelete}>
                delete
              </Button>
            </td>
          </tr>
        </>
      );
    });
  const changePage = ({ selected }) => {
    setPageNum(selected);
  };
  return (
    <>
      <input
        type="text"
        id="myInput"
        onKeyUp={searchFunction}
        placeholder="Search for names.."
        title="Type in a name"
      />
      <table id="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{displayData}</tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={numberOfPage}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </>
  );
}
