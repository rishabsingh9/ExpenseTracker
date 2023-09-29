
// const Sib = require('sib-api-v3-sdk');
// require('dotenv').config();
// const client = Sib.ApiClient.instance;

// const apiKey = client.authentications['api-key'];
//  apiKey.apiKey='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';

// const tranEmailApi = new Sib.TransactionalEmailsApi();
// const sender = {
//     email: 'rishabsinghrs1733@gmail.com',
// };
// const receivers = [
//     {
//         email: 'rishabsinghrs369@gmail.com',
//     },
// ];

// exports.sendEmail = async () => {
//     try {
//         const result = await tranEmailApi.sendTransacEmail({
//             sender,
//             to: receivers,
//             subject: 'Reset your password',
//             textContent: 'hello how are you',
//         });
//         // You can process the result here if needed
//         console.log('Email sent successfully:', result);
//         return result;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         // You can handle the error here and return an error message or throw it further if needed
//       //  throw new Error('Error sending email');
//     }
// };

const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
          await  Forgotpassword.create({ id , active: true,userId:user.id })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey('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')

            const msg = {
                to: email, // Change to your recipient
                from: 'rishabsinghrs1733@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}