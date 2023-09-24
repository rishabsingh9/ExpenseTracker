var myform=document.getElementById('expense-form')
myform.addEventListener('submit',onsubmit)
function onsubmit(e){
e.preventDefault();
var selectElement = document.getElementById("categories");
var selectedOption = selectElement.options[selectElement.selectedIndex];
let obj={
    amount:document.getElementById('expenseamount').value,
    des:document.getElementById('description').value,
    category:selectedOption.textContent
}
  axios.post('http://localhost:3000/expense/add-expense',obj)
  .then(response=>{
    displayuserdetails(response.data.newExpense);
  })
  .catch(err=>console.log(err));
}
window.addEventListener('DOMContentLoaded',()=>{
  axios.get('http://localhost:3000/expense/get-expenses')
.then(response=>{
  console.log(response.data.dt[0])
  let len=response.data.dt.length
  for(let i=0;i<len;i++){
    displayUserDetails(response.data.dt[i]);
   }
})
.catch(err=>console.log(err));
})

function displayuserdetails(obj){
    var parent=document.getElementById('ule');
    var child=document.createElement('li');
    child.textContent=`${obj.amount} - ${obj.category} - ${obj.des} `;
    parent.appendChild(child);
    var deletebtn=document.createElement('input')
    deletebtn.type='button'
    deletebtn.value='delete'
    child.appendChild(deletebtn);
    deletebtn.onclick=() =>{
       const deleted=obj.id;
       axios.delete(`http://localhost:3000/expense/delete-expense/${deleted}`)
    .then(() => {
        parent.removeChild(child); // Remove from the frontend after successful deletion
      })
      .catch(err => console.log(err));
      }
}