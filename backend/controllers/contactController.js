const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

// POST /api/contact
const handleContact = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    // Save contact message to DB
    const newContact = new Contact({ fullName, email, message });
    await newContact.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your message – Excel Analysis Platform",
      html: `
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Thank you for contacting Excel Analysis Platform. We have received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We'll get back to you shortly.</p>
        <br />
        <p>— Team Excel Analysis Platform</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Confirmation email sent to user.",
    });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { handleContact };
