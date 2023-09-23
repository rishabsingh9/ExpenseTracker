var loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', login);

    function login(e) {
        let flag = false;
        e.preventDefault();
        let obj = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }
        axios.get('http://localhost:3000/expense/get-users')
            .then(response => {
                console.log(response.data.allUsers);
                let len = response.data.allUsers.length;
                for (let i = 0; i < len; i++) {
                    let curremail = response.data.allUsers[i].email;
                    let currrpassword = response.data.allUsers[i].password;
                    if (obj.email == curremail && obj.password == currrpassword) {
                        flag=true;
                        alert('Login Successful');
                        break;
                    }
                    else if(obj.email == curremail && obj.password != currrpassword){
                        flag=true;
                        alert('Password Do not Match');
                    }
            

                }
                if (flag == false) {
                    alert('Email Does not exist');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
