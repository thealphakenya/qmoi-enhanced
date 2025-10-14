export function useToast() {
  return {
    toast: (options: any) => {
      // You can implement a real toast here or integrate with a library
      console.log('Toast:', options);
    },
  };
}