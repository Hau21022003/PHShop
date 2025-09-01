import { chatApiRequest } from "@/api-requests/chat";
import { handleErrorApi } from "@/lib/error";
import { SendMessageBodySchema } from "@/schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useSendMessage() {
  const sendMessageForm = useForm({
    resolver: zodResolver(SendMessageBodySchema),
    defaultValues: {
      message: "",
      images: [],
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    const images = sendMessageForm.getValues("images") || [];
    if (images.length >= 4) {
      toast.error("Error", {
        duration: 2000,
        description: "You can only upload up to 4 images.",
      });
      return;
    }
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      try {
        const formData = new FormData();
        formData.append("image", imageFiles[0]);
        const uploadRsp = await chatApiRequest.uploadImage(formData);
        sendMessageForm.setValue("images", [
          ...(sendMessageForm.getValues("images") || []),
          uploadRsp.payload.imageUrl,
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  const removeImage = (url: string) => {
    sendMessageForm.setValue(
      "images",
      (sendMessageForm.watch("images") || []).filter(
        (imageUrl) => imageUrl !== url
      ),
      { shouldValidate: true }
    );
  };

  return { sendMessageForm, fileInputRef, handleFileChange, removeImage };
}
