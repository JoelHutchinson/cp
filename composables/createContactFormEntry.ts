const key = "create-contact-form-entry";

export const useContactFormEntry = () => {
  const { profile } = useFetchProfile();

  const createContactFormEntry = async (contactFormEntry: any) => {
    return await $fetch(`/api/contact-form-entries`, {
      method: "POST",
      body: { ...contactFormEntry, profileId: profile.value?.id },
    });
  };

  return { createContactFormEntry };
};
