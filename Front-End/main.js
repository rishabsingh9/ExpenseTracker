var form=document.getElementById('form');
form.addEventListener('submit',onsubmit);

async function onsubmit(e){
    e.preventDefault();
    let obj={
        name:document.getElementById("name").value,
        email:document.getElementById("email").value,
        password:document.getElementById("password").value
    }
    axios.post('http://localhost:3000/expense/add-user',obj)
    .then(response=>{
        console.log(response.data.newUser);
    })
    .catch(err=>{
        alert('email already exists');
        console.log(err);
    })
}