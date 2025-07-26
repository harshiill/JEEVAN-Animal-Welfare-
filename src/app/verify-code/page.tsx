/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "../../components/ui/input-otp";
import { toast } from "sonner";
import LoadingSpinner from '../_components/LoadingSpinner/page';

export default function VerifyCodePage() {
  const [otp, setOtp] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleComplete = async (code: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/verify-code', { code });

      setSuccess(res.data.message || 'Verification successful!');
      setIsComplete(true);
      toast.success(res.data.message || 'Verification successful!');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setOtp(value);
    setIsComplete(false);
    setError('');
    setSuccess('');
    if (value.length === 6) {
      handleComplete(value);
    }
  };
    if(isLoading) {
     return (
      <LoadingSpinner />
      )  
        }
        
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 md:p-10 border">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Verify Your Email</h3>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleChange}
            disabled={isLoading || isComplete}
            className="scale-110"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {isLoading && <p className="text-sm text-muted-foreground">Verifying...</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!isComplete && !isLoading && otp.length > 0 && (
            <p className="text-xs text-gray-400">{otp.length}/6 characters entered</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mt-1">
            Didn&#39;t receive the code? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
