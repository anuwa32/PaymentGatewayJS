const express = require('express');
const bodyparser = require('body-parser')
const stripe = require('stripe')("");

const uuid = require('uuid').v4;
const cors = require('cors');


const app = express();
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});

//const PORT = process.env.PORT || 5000

app.post('/checkout', async(req,res) => {

     console.log("Request:",req.body);

     let error,status;
     try {
       
     const {product, token} = req.body
     const customer = await stripe.customers.create({

        email: token.email,
        source: token.id,
     });

     const key = uuid()

     const charge = await stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        {
          key,
        }
     );

     console.log("Charge:", { charge });
     status = "success";


    
 
     } catch (error) {
       
       console.log(error)
       status = "failure";
     }

     res.json({ error, status });

})

app.listen(PORT,() => {

    console.log("App is running on port 5000")
})