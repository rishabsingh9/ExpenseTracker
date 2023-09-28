var form=document.getElementById('forgot-password-form');
form.addEventListener('submit',async()=>{
    let obj={
        email:document.getElementById("email").value,
    }
    try {
        const response=await axios.post('http://localhost:3000/password/forgot-password',obj,{headers:{"Authorization":token}});
    } catch (error) {
        console.log(error);
    }
})