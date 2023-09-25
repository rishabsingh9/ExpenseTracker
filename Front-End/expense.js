var myform=document.getElementById('expense-form')
myform.addEventListener('submit',onsubmit)
function onsubmit(e){
e.preventDefault();
var selectElement = document.getElementById("categories");
var selectedOption = selectElement.options[selectElement.selectedIndex];
let obj={
  expenseAmount:document.getElementById('expense').value,
    description:document.getElementById('description').value,
    category:selectedOption.textContent
}
const token=localStorage.getItem('token');
  axios.post('http://localhost:3000/expense/add-expense',obj,{headers:{"Authorization":token}})
  .then(response=>{
    displayUserDetails(response.data.newExpense);
  })
  .catch(err=>console.log(err));
}
window.addEventListener('DOMContentLoaded',()=>{
  const token=localStorage.getItem('token');
  axios.get('http://localhost:3000/expense/get-expenses',{headers:{"Authorization":token}})
.then(response=>{
  console.log(response.data.dt[0])
  let len=response.data.dt.length
  for(let i=0;i<len;i++){
    displayUserDetails(response.data.dt[i]);
   }
})
.catch(err=>console.log(err));
})

function displayUserDetails(obj){

    var parent = document.getElementById('ule');
    var div = document.createElement('div');
    
    // Add the "expense-item" class to the div
    div.classList.add('expense-item');
    
    div.innerHTML = `${obj.expenseAmount}Rs For ${obj.description} in Category ${obj.category}`;

    const dltbtn = document.createElement('button');
    dltbtn.textContent = 'delete';
    dltbtn.classList.add('dltbtn');
    div.appendChild(dltbtn);
    parent.appendChild(div);

    dltbtn.onclick =async () => {
      const token=localStorage.getItem('token');
      const deleted = obj.id;
     await axios.delete(`http://localhost:3000/expense/delete-expense/${deleted}`,{headers:{"Authorization":token}})
        .then(() => {
          parent.removeChild(div); // Remove the div from the frontend after successful deletion
        })
        .catch(err => console.log(err));
      }
   
}