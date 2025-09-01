import { chatApiRequest } from "@/api-requests/chat";
import { Role } from "@/enums/user.enum";
import { handleErrorApi } from "@/lib/error";
import {
  defaultPageMeta,
  PageMetaType,
  PaginationBody,
} from "@/schemas/common.schema";
import { Message } from "@/types/chat.type";
import { buildPaginatedMeta } from "@/utils/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export function useLoadMessage(
  role: Role,
  addMessageToTop: (message: Message) => void,
  userId?: string
) {
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;
  const [pageMeta, setPageMeta] = useState<PageMetaType>({
    ...defaultPageMeta,
    pageSize,
  });
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const paginationForm = useForm({
    resolver: zodResolver(PaginationBody),
    defaultValues: { pageSize: pageSize },
  });

  const loadMessage = useCallback(async () => {
    let messages: Message[] = [];
    let totalMessages = 0;
    setIsLoading(true);
    try {
      if (role === Role.USER) {
        const { items, total } = (
          await chatApiRequest.findMine(paginationForm.getValues())
        ).payload;
        messages = items;
        totalMessages = total;
      }

      if (role === Role.ADMIN && userId) {
        const { items, total } = (
          await chatApiRequest.findByUserId({
            ...paginationForm.getValues(),
            userId: userId,
          })
        ).payload;
        messages = items;
        totalMessages = total;
      }

      const newPageMeta = buildPaginatedMeta(
        totalMessages,
        paginationForm.getValues("pageNumber") || 1,
        pageSize
      );
      setPageMeta(newPageMeta);

      // const reversed = messages.reverse();

      // Add từng message lên top
      messages.forEach((msg) => addMessageToTop(msg));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoading(false);
    }
  }, [paginationForm, addMessageToTop, role, userId]);

  useEffect(() => {
    const initChat = async () => {
      await loadMessage();
      // Scroll xuống dưới cùng
      const el = messageContainerRef.current;
      if (el) {
        setTimeout(() => {
          el.scrollTop = el.scrollHeight;
        }, 0);
      }
    };
    initChat();
  }, []);

  const handleScroll = useCallback(() => {
    const el = messageContainerRef.current;
    if (!el || !pageMeta.hasNextPage || isLoading) return;

    const { scrollTop, scrollHeight: oldScrollHeight } = el;
    if (scrollTop < 30) {
      if (!isLoading) {
        const rawPageNumber = paginationForm.getValues("pageNumber");
        const pageNumber = rawPageNumber ? rawPageNumber + 1 : 1;
        paginationForm.setValue("pageNumber", pageNumber);
        loadMessage();
      }
    }
  }, [pageMeta, isLoading, loadMessage, paginationForm]);

  useEffect(() => {
    const el = messageContainerRef.current;

    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, messageContainerRef]);

  return { messageContainerRef, isLoading };
}
