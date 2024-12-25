const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'akhmad.badran@gmail.com',
      pass: 'yhfx qoct ceso glkb',
    },
  });

router.post('/', async(req, res) => {
    const order = req.body;
    products = order.orderItems;
    try {
      // Find the user by ID
      const response = await axios.get('http://localhost:3000/users'); // Adjust the URL as needed
      const users = response.data;
  
      const user = users.find(u => u.id === order.user); // Adjust this logic based on your user ID field
  
      if (!user) {
          return res.status(404).send('User not found');
      }
      // Create an HTML table for the order details
      let htmlTable = `
        <h3>التفاصيل</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Details</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">User Name</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">User Email</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">User Phone</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.phone}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Shipping Address</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.shippingAddress1}, ${order.shippingAddress2}, ${order.city}, ${order.zip}, ${order.country}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Phone</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.phone}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.status}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Total Price</td>
            <td style="border: 1px solid #ddd; padding: 8px;">$${order.totalPrice}</td>
          </tr>
        </table>
        <br/>
        <br/>
        <br/>
        
  
      `;
  
   
      // Prepare the email options
      const mailOptions = {
        from: 'noreply@yourdomain.com', // Default sender
        to: 'akhmad.badran@gmail.com',
        subject: 'طلب جديد',
        html: htmlTable, // Use the HTML table as the email body
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Email sent: ' + info.response);
      });
  
      res.status(200).send('Order received and email sent');
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  // webhook endpoint end


  // sending whatsapp message start.................................................................................................................................


  const accountSid = process.env.ACCOUNTSID ; // Your Twilio account SID
  const authToken = process.env.AUTHTOKEN ; // Your Twilio auth token
  const client = twilio(accountSid, authToken);


  router.post('/whatsapp', async (req, res) => {
    const order = req.body;
    const products = order.orderItems;
    
    try {
        // Find the user by ID
        const response = await axios.get('http://localhost:3000/users'); // Adjust the URL as needed
        const users = response.data;
    
        const user = users.find(u => u.id === order.user); // Adjust this logic based on your user ID field
    
        if (!user) {
            return res.status(404).send('User not found');
        }

        // New route to send order to WhatsApp
         let whatsappMessage =  `
        📦 *New Order:
        💰 *Total Price: ${order.totalPrice}

        👤 *User Information:
        👤 *Name: ${user.name}
        📧 *Email: ${user.email}
        📞 *Phone: ${user.phone}
        🏠 *Shipping Address: ${user.city}, ${user.city},


        The Order :
        `;

        // Append orderItems details to the message
        order.orderItems.map((item, index) => {
        whatsappMessage += `
        🛒 *Item ${index + 1}:*
        📦 *Product Name:* ${item.product.name}
        🔢 *Quantity:* ${item.quantity}
        💵 *Price:* ${item.product.price}  
  `;
});


        // Send WhatsApp message
        client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio WhatsApp number
            to: 'whatsapp:+972598817229', // The recipient's WhatsApp number
            body: whatsappMessage,
        })
        .then(message => console.log('WhatsApp message sent: ' + message.sid))
        .catch(error => console.error('Error sending WhatsApp message:', error));
    
        res.status(200).send('Order received, email and WhatsApp message sent');
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




  // sending whatsapp message end...........................................................................................................................








  module.exports =router;