import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_autocare";
const TEMPLATE_ID = "template_fzac05d";
const PUBLIC_KEY = "oZByMY9eHMMtF0iTt";

emailjs.init({
  publicKey: PUBLIC_KEY,
});

export const sendBookingEmail = async (booking, customer) => {
  const templateParams = {
    email: customer.email,
    customer_name: customer.name,

    status: booking.status,

    booking_reference: booking.bookingReference,

    service: booking.serviceType,

    vehicle: booking.vehicleName,

    registration: booking.registration,

    date: booking.serviceDate,

    time: booking.serviceTime,
  };

  console.log("EMAIL TEMPLATE PARAMS:", templateParams);

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log("EMAILJS SUCCESS:", response);

    return response;
  } catch (error) {
    console.error("EMAILJS ERROR:", error);
    throw error;
  }
};