import { useState, useEffect } from 'react';

const OtpTimer = ({ initialMinutes = 5, onResend }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Stop if we hit 0
    if (secondsRemaining <= 0) {
      setIsExpired(true);
      return;
    }

    const timerId = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsRemaining]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResendClick = () => {
      
      // 1. Trigger your backend API call (passed as a prop)
      if (onResend) {
        let data=onResend()
        if(data){
          
          // 2. Reset the timer state
          setSecondsRemaining(initialMinutes * 60);
          setIsExpired(false);
        }
      };
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isExpired ? (
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>
          OTP expires in: <span style={{ fontWeight: 'bold' }}>{formatTime(secondsRemaining)}</span>
        </div>
      ) : (
        <button 
          onClick={handleResendClick}
          className='bg-blue-400'
          style={{
            padding: '10px 20px',
            
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OtpTimer;