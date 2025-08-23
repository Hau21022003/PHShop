import { settingApiRequest } from "@/api-requests/setting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/error";
import {
  SettingItemBody,
  SettingItemType,
  SettingKey,
} from "@/schemas/setting.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SaveFreeShippingProps {
  open: boolean;
  onClose: () => void;
}

export default function SaveFreeShipping({
  onClose,
  open,
}: SaveFreeShippingProps) {
  const form = useForm({
    resolver: zodResolver(SettingItemBody),
    defaultValues: { key: SettingKey.FREE_SHIPPING },
  });
  const load = async () => {
    try {
      const freeShippingItem = (
        await settingApiRequest.get(SettingKey.FREE_SHIPPING)
      ).payload;
      form.reset(freeShippingItem);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data: SettingItemType) => {
    try {
      await settingApiRequest.set(data);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Free Shipping</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          <Form {...form}>
            <form
              // className="p-4 rounded-lg bg-gray-100"
              onSubmit={form.handleSubmit((data) => {
                onSubmit(data);
              })}
            >
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Free Shipping Threshold</FormLabel>
                    <Input
                      // type="number"
                      className="bg-white"
                      placeholder="Enter order amount (e.g., 700.000)"
                      // {...field}
                      value={
                        field.value
                          ? new Intl.NumberFormat("vi-VN").format(field.value)
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\./g, "");
                        const numeric = parseInt(raw, 10);
                        if (!isNaN(numeric)) {
                          field.onChange(numeric);
                        } else {
                          field.onChange(0);
                        }
                      }}
                    />
                  </FormItem>
                )}
              />

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm cursor-pointer bg-black text-white font-medium text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
