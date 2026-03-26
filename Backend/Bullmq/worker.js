import { Worker } from 'bullmq';
import { transporter } from '../utilities/transporter.utility.js';

// 1. Configure Nodemailer Transporter
// already done

// 2. Initialize Worker
const worker = new Worker(
  'email-queue',
  async (job) => {
    const { email, otp } = job.data;
    
    console.log(`[Worker] Sending OTP to: ${email}`);

    // The core sending logic
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
    },
    concurrency: 5, // Process 5 emails in parallel
  }
);

// 3. Event Listeners for Monitoring
worker.on('completed', (job) => {
  console.log(`[Success] Job ${job.id} has been completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`[Failed] Job ${job.id} failed with error: ${err.message}`);
});

export default worker;

