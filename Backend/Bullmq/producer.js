import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// 1. Setup Redis Connection
// Pro-tip: For your rack, move these to a separate 'redisConfig.js' later
const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required by BullMQ
});

// 2. Initialize Queue
const emailQueue = new Queue('email-queue', { connection });
const ForgotPassOTPQueue = new Queue('Forgot-pass-queue', { connection });
const ResendForgotPassOTPQueue = new Queue('resend-Forgot-pass-queue', { connection });
const ResendEmailVerificationQueue = new Queue('resend-Email-verification-queue', { connection });

/**
 * Adds an email job to the Redis queue
 * @param {string} email 
 * @param {string|number} otp 
 */
export const addEmailToQueue = async (email, otp) => {
  try {
    await emailQueue.add(
      'send-otp-email',
      { email, otp },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 3000, 
        },
        removeOnComplete: true, // Saves memory in your physical rack
      }
    );

    console.log(`[Queue] Job added for: ${email}`);
    return true;
  } catch (error) {
    console.error('[Queue Error] Could not add job:', error);
    return false;
  }
};
export const addOTPInForgotPassQueue = async (email, otp) => {
  try {
    await ForgotPassOTPQueue.add(
      'send-fogotpass-otp-email',
      { email, otp },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 3000, 
        },
        removeOnComplete: true, // Saves memory in your physical rack
      }
    );

    console.log(`[Queue] Job added for forgotpass: ${email}`);
    return true;
  } catch (error) {
    console.error('[Queue Error] Could not add for forgotpass job:', error);
    return false;
  }
};
export const addResendOTPInForgotPassQueue = async (email, otp,firstName) => {
  try {
    await ResendForgotPassOTPQueue.add(
      'resend-fogotpass-otp-email',
      { email, otp,firstName },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 3000, 
        },
        removeOnComplete: true, // Saves memory in your physical rack
      }
    );

    console.log(`[Queue] Job added for resendforgotpass: ${email}`);
    return true;
  } catch (error) {
    console.error('[Queue Error] Could not add for resendforgotpass job:', error);
    return false;
  }
};
export const addResendOTPForEmailVerification = async (email, otp,firstName) => {
  try {
    await ResendEmailVerificationQueue.add(
      'resend-emailverifcation-otp-email',
      { email, otp,firstName },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 3000, 
        },
        removeOnComplete: true, // Saves memory in your physical rack
      }
    );

    console.log(`[Queue] Job added for resendemailvarification: ${email}`);
    return true;
  } catch (error) {
    console.error('[Queue Error] Could not add for resendemailverification job:', error);
    return false;
  }
};