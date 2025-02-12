import React from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface SubmitDialogProps {
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
  onClose: () => void;
}

export function SubmitDialog({ submitStatus, errorMessage, onClose }: SubmitDialogProps) {
  return (
    <AlertDialog open={submitStatus !== 'idle'}>
      <AlertDialogContent>
        <AlertDialogTitle>
          {submitStatus === 'success' ? 'Success!' : 'Error'}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {submitStatus === 'success'
            ? 'Your project has been successfully created!'
            : `An error occurred: ${errorMessage}. Please try again.`}
        </AlertDialogDescription>
        <Button onClick={onClose}>Close</Button>
      </AlertDialogContent>
    </AlertDialog>
  )
} 