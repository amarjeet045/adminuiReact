import React, { useState, useEffect,useRef } from "react";
import { Button,Modal,Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function Home() {
  const emailRef =  useRef();
  const nameRef =  useRef();
  const roleRef =  useRef();
  console.log(nameRef)
  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [show, setShow] = useState(false);
  const [editId,setEditId] = useState(null)
  const [selectShow,setSelectShow] =  useState(null);

  const handleClose = () => setShow(false);
  function checkAll(e) {
    var value  = false

  if(e.target.checked){
    value = true;
  }
  setSelectShow(true)

console.log("select all clicked",value)
  }
  function check (e) {
    setSelectShow(true)
    console.log(e.target.checked)
  }
  function handleEdit(e) {
    console.log(e.target.getAttribute("id"));
    
    console.log("edit button is clicked");
    console.log(document.getElementById("name"))
    setShow(true);
    setEditId(e.target.getAttribute("id"))
    
  }
  function handleDelete(e) {
    console.log(e.target.getAttribute("id"));
    const id = e.target.getAttribute("id").toString()
    console.log("delete button");
    const filterDelete = data.filter(doc =>doc.id !==id);
    console.log(filterDelete)
    setData(filterDelete)
  }
  function handleEditRecord(e) {
    if(editId!==0)
    {
    console.log(nameRef.current.value)
    if(nameRef.current.value!==""&&emailRef.current.value!==""&&roleRef.current.value!=="")
    {
      const index = data.findIndex(doc =>doc.id===editId.toString())
      console.log(index)
      const currentValue = {
        name:nameRef.current.value,
        id:editId.toString(),
        email:emailRef.current.value,
        role:roleRef.current.value
      }
      data[index] = currentValue;
      setData(data)
      setEditId(0)
    setShow(false);
    }
    
    
    
    }
    
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
              <input name="all" type="checkbox" onChange={check} />
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
  
    console.log(selectShow)
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
         <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
         <Form.Group>
           <Form.Label>Name</Form.Label>
           <Form.Control type="text" id="name" 
           ref = {nameRef}
           required
           ></Form.Control>
         </Form.Group>
         <Form.Group>
           <Form.Label>Email</Form.Label>
           <Form.Control  ref={emailRef} type="email" required ></Form.Control>
         </Form.Group>
         <Form.Group>
           <Form.Label>Role</Form.Label>
           <Form.Control type="text" ref = {roleRef} required></Form.Control>
         </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditRecord}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <table id="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox"  onChange = {checkAll}/>
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
