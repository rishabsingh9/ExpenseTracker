

var myform=document.getElementById('expense-form')
myform.addEventListener('submit',onsubmit)
async function onsubmit(e){
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

try{
  await axios.post('http://localhost:3000/expense/add-total-expense',obj,{headers:{"Authorization":token}})
  console.log("working");
}
catch(err){
  console.log(err);
}
}
async function getExpenses(page,limit){
  try {
    const token=localStorage.getItem('token');
  const response =await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&limit=${limit} `,{headers:{"Authorization":token}});
  console.log(response.data);
  clearExpenses();
let len=response.data.expenses.length
  for(let i=0;i<len;i++){
    displayUserDetails(response.data.expenses[i]);
   }
   showPagination(response.data);
  } catch (error) {
    console.log(error);
  }
}
function clearExpenses() {
  const parent = document.getElementById('ule');
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
window.addEventListener('DOMContentLoaded',async ()=>{
  const token=localStorage.getItem('token');
//   axios.get('http://localhost:3000/expense/get-expenses',{headers:{"Authorization":token}})
// .then(response=>{
//   console.log(response.data.dt[0])
//   let len=response.data.dt.length
//   for(let i=0;i<len;i++){
//     displayUserDetails(response.data.dt[i]);
//    }

// })
// .catch(err=>console.log(err));
const page=1;
let limit=localStorage.getItem('limit');
if(!limit){
  limit=5;
}
limit=Number(limit);
getExpenses(page,limit);


if(isPremium()){
  const div=document.getElementById('dwm');
  div.style.display='block'
  premiumMessage.style.display = 'block';

  const premiumuser=document.getElementById('premiumuser');
  const leaderboardbtn=document.createElement('button');
  leaderboardbtn.textContent="Show Leaderboard";
  leaderboardbtn.classList.add('leaderboardbtn');
  premiumuser.appendChild(leaderboardbtn);

  const downloadbtn=document.createElement('button');
  downloadbtn.textContent='Download';
  downloadbtn.classList.add('downloadbtn');
  premiumuser.appendChild(downloadbtn);

  async function download(){
    const token=localStorage.getItem('token');
    try {
      const response=await axios.get('http://localhost:3000/download',{headers:{"Authorization":token}})
      if(response.status===200){
        var a=document.createElement('a');
        a.href=response.data.fileUrl;
        a.download='myexpense.csv';
        a.click();
      }
    } catch (error) {
      console.log(error);
    }
  }

  downloadbtn.addEventListener('click',download);



  leaderboardbtn.addEventListener('click',async()=>{
    try{
      const leaderboard=await axios.get('http://localhost:3000/premium/show-leaderboard',{headers:{"Authorization":token}})
      let len=leaderboard.data.length;
      for(let i=0;i<len;i++){
      displayLeaderboard(leaderboard.data[i]);
      }
      }
      catch(err){
        console.log("why")
        console.log(err);
      }
    })
}
else{
  var premium=document.getElementById('premium');
      premium.style.display='block';
      premiumMessage.style.display = 'none';
}
})
 function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    return undefined
  }
}
function isPremium(){
  const token=localStorage.getItem('token');
  const decodetoken=parseJwt(token);
  console.log(decodetoken);
  const isPremiumUser=decodetoken.isPremiumUser;
  if(isPremiumUser){
    return true;
  }
  else{
    return false;
  }
//   try{
//   const response=await axios.get(`http://localhost:3000/expense/user/get-user`,{headers:{"Authorization":token}})
//   if(!response.data.user.isPremiumUser){
//     var premium=document.getElementById('premium');
//     premium.style.display='block';
//     premiumMessage.style.display = 'none';
//     return false;
//   }
//   else{
//     premiumMessage.style.display = 'block';
//     return true;
//   }
  
// }
// catch(err){
//   console.log(err);
// }
}

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
var premium=document.getElementById('premium');
premium.addEventListener('click',payment);

async function payment(e){
  const token=localStorage.getItem('token');
  const response=await axios.get(`http://localhost:3000/purchase/premium-membership`,{headers:{"Authorization":token}})
  console.log(response);

  var options={
    "key":response.data.key_id,
    "order_id":response.data.order.id,
    "handler":async function(response){
      await axios.post(`http://localhost:3000/purchase/update-transaction-status`,{
        order_id:options.order_id,
        payment_id:response.razorpay_payment_id,
      },{headers:{"Authorization":token}});
      alert('You are a Premium user Now');
    }
  }
  const rzp1=new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed',function(response){
    console.log(response);
    alert('something went wrong');
  })
}

function displayLeaderboard(obj){
const leaderboard=document.getElementById("leaderboard");

var parent = document.getElementById('ule2');
var div = document.createElement('div');

// Add the "expense-item" class to the div
div.classList.add('expense-item');
if(!obj.totalExpense){
  div.innerHTML = `Name ${obj.name} , TotalExpense 0`;
}
else{
div.innerHTML = `Name ${obj.name} , TotalExpense ${obj.totalExpense}`;
}
parent.appendChild(div);
}

function showPagination({
  currentPage,
      hasNextPage,
      nextPage,
      hasPreviousPage,
      previousPage,
      lastPage
}){
const pagination=document.getElementById("pagination");
pagination.innerHTML='';

const label = document.createElement('label');
label.textContent = 'Select Rows:';

// Create a select element
const select = document.createElement('select');
select.id="myselect";

// Create an array of option values
const options = [10, 25, 50, 100];

// Create and append option elements to the select element
options.forEach(optionValue => {
  const option = document.createElement('option');
  option.value = optionValue;
  option.textContent = optionValue;
  select.appendChild(option);
});
pagination.appendChild(label);
pagination.appendChild(select);

select.addEventListener('change', () => {
  const selectedLimit = select.value;
  // Call getExpenses with the updated limit
  localStorage.setItem('limit',selectedLimit);
});
const limit=localStorage.getItem('limit');


if (hasPreviousPage) {
  const prevButton = document.createElement("button");
  prevButton.innerHTML = `${previousPage}`;
  prevButton.addEventListener("click", () => getExpenses(previousPage,limit));
  pagination.appendChild(prevButton);
}
const currButton = document.createElement("button");
  currButton.innerHTML = `<h3>${currentPage}</h3>`;
  currButton.addEventListener("click", () => getExpenses(currentPage,limit));
  pagination.appendChild(currButton);
if (hasNextPage) {
  const nextButton = document.createElement("button");
  nextButton.innerHTML = `${nextPage}`;
  nextButton.addEventListener("click", () => getExpenses(nextPage,limit));
  pagination.appendChild(nextButton);
}
}
