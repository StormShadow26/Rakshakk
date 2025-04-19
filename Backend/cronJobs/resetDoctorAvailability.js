const cron = require('node-cron');
const Doctor = require('../models/doctor.model');


const defaultSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

// Run at 7:00 PM every day
cron.schedule('0 19 * * *', async () => {
  try {
    console.log('⏰ Running daily reset for doctor availability...');

    await Doctor.updateMany({}, {
      $set: {
        availability: defaultSlots,
        bookedSlots: []
      }
    });

    console.log('✅ Doctor availability and bookings reset successfully.');
  } catch (error) {
    console.error('❌ Error resetting doctor data:', error.message);
  }
});
