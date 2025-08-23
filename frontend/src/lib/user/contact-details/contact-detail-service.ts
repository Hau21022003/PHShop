import { userApiRequest } from "@/api-requests/user";
import { authStorage } from "@/lib/auth/auth-storage";
import { contactDetailsStorage } from "@/lib/user/contact-details/contact-detail-storage";
import { ContactDetailsType } from "@/schemas/account.schema";

export const contactDetailsService = {
  saveContactDetails: async (contactDetails: ContactDetailsType) => {
    if (Boolean(authStorage.getUser())) {
      const user = (await userApiRequest.updateContactDetails(contactDetails))
        .payload;
      return user.contactDetails;
    } else {
      contactDetailsStorage.saveContactDetails(contactDetails);
      return contactDetailsStorage.getContactDetails();
    }
  },
  getContactDetails: async () => {
    if (Boolean(authStorage.getUser())) {
      const user = (await userApiRequest.getProfile()).payload;
      return user.contactDetails;
    } else {
      // contactDetailsStorage.saveContactDetails(contactDetails);
      return contactDetailsStorage.getContactDetails();
    }
  },
};
