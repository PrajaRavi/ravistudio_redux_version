import { Worker } from 'bullmq';
import { transporter } from '../utilities/transporter.utility.js';
export const ForgotPassWorker = new Worker(
  'Forgot-pass-queue',
  async (job) => {
    const { email, otp } = job.data;
    
    console.log(`[Worker] Sending OTP to: ${email}`);

    // The core sending logic
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Your Password - Music App",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Use the code below to proceed:</p>
          <h1 style="color: #3fa9f5; letter-spacing: 5px;">${otp}</h1>
          <p>This code <b>expires in 5 minutes</b>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
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
ForgotPassWorker.on('completed', (job) => {
  console.log(`[Success] Job ${job.id} forgotpass has been completed!`);
});

ForgotPassWorker.on('failed', (job, err) => {
  console.error(`[Failed] Job ${job.id} forgotpass failed with error: ${err.message}`);
});

