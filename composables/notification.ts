export const useNotification = (timeout: number = 5000) => {
  const toast = useToast();

  const success = (params: { title: string; message: string }) => {
    toast.add({
      title: params.title,
      description: params.message,
      icon: "i-heroicons-check-circle",
      color: "green",
      timeout,
    });
  };

  const info = (params: { title: string; message: string }) => {
    toast.add({
      title: params.title,
      description: params.message,
      icon: "i-heroicons-information-circle",
      color: "blue",
      timeout,
    });
  };

  const warning = (params: { title: string; message: string }) => {
    toast.add({
      title: params.title,
      description: params.message,
      icon: "i-heroicons-exclamation-triangle",
      color: "amber",
      timeout,
    });
  };

  const error = (params: { title: string; message: string }) => {
    toast.add({
      title: params.title,
      description: params.message,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
      timeout: 5000,
    });
  };
  return { success, info, warning, error };
};
