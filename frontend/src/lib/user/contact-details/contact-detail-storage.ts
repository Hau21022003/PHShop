import { ContactDetailsType } from "@/schemas/account.schema";
import { storage } from "@/utils/storage";

const CONTACT_DETAILS_KEY = "contact-details";

export const contactDetailsStorage = {
  getContactDetails() {
    return storage.get(CONTACT_DETAILS_KEY) as ContactDetailsType;
  },

  saveContactDetails(contactDetails: ContactDetailsType) {
    storage.set(CONTACT_DETAILS_KEY, contactDetails);
  },

  clear() {
    storage.remove(CONTACT_DETAILS_KEY);
  },
};
