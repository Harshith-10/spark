import { toast as sonnerToast } from 'sonner';

// Define the toast function using sonner
const toast = sonnerToast;

// Update the useToast hook to return the sonner toast function
function useToast() {
  // The hook now simply provides access to the sonner toast function
  return {
    toast,
  };
}

export { useToast, toast };
