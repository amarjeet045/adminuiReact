import React, { useEffect, useRef, useState } from "react";
import {Button} from 'react-bootstrap';

export default function Dashboard() {
  const [data, setData] = useState([]);
  function handleEdit(e) {
    console.log(e.target.getAttribute("id"));
    console.log(data)
    console.log("edit button is clicked");
  }
  function handleDelete(e) {
    console.log(e.target.getAttribute("id"));
    console.log("delete button");
  }
  function searchFunction() {
    var input, filter, table, tr, td, i, txtValue;
     input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    console.log(filter)
     table = document.getElementById("data-table");
  
   tr = table.getElementsByTagName("tr");
   for (i = 1; i < tr.length; i++) {
      
    td = tr[i].getElementsByTagName("td")[1];
    console.log(tr[i].getElementsByTagName("td")[2])
    
    if (td) {
       
      txtValue = td.textContent || td.innerText;
      
      
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
          td =tr[i].getElementsByTagName("td")[2];
          if(td){
              txtValue = td.textContent || td.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                }
              else{
                  td =tr[i].getElementsByTagName("td")[3];
                  if(td){
                      txtValue = td.textContent || td.innerText;
                      if (txtValue.toUpperCase().indexOf(filter) > -1) {
                          tr[i].style.display = "";
                        }
                        else{
                          tr[i].style.display = "none";
                        }  
              }
          }

       
      }
    }       
  }
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
        console.log(response);

        setData(response);
        // setCommitHistory(response.items);
        // setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(data.length)
  
  const perPageRecord =  10;
  const totalRecords = data.length;
  const currentPage = 1;
  const numberOfPage = Math.ceil(totalRecords/perPageRecord)
  console.log(numberOfPage)
  return (
    <>
    <input type="text" id="myInput" onKeyUp={searchFunction} placeholder="Search for names.." title="Type in a name" />
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
        <tbody>
          {data.map((doc) => (
            <tr key={doc.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>{doc.role}</td>
              <td style={{display:"flex",gap:"20px"}}>
                <Button id={doc.id} onClick={handleEdit} style={{marginLeft:"10px"}}>
                  edit
                </Button>
                <Button id={doc.id} onClick={handleDelete}>
                  delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {numberOfPage.length>0?numberOfPage.map(num =>console.log("num")):""}
    </>
  );
}
