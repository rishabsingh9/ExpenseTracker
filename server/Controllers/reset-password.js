const Sib=require('sib-api-v3-sdk');
require('dotenv').config();
const client=Sib.ApiClient.instance;

const apiKey=client.authentications['api-key'];
apiKey.apiKey=process.env.API_KEY

const tranEmailApi=new Sib.TransactionalEmailsApi();
const sender={
    email:'rishabsinghrs1733@gmail.com'
}
const receivers=[
    {
        email:'rishabsinghrs369@gmail.com'
    }
]
tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject:"Subscribe me",
    textContent:"hello how are you"
})
.then(console.log)
.catch(console.log);