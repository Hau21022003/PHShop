"use client";
import { categoryApiRequest } from "@/api-requests/category";
import RadioItem from "@/app/admin/category/components/ratio-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/error";
import {
  AddCategoryBody,
  AddCategoryBodyType,
  CategoryType,
} from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SaveCategoryProps {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  category?: CategoryType;
  loadCategoryList: () => void;
}
export default function SaveCategoryDialog({
  category,
  isEdit,
  loadCategoryList,
  onClose,
  open,
}: SaveCategoryProps) {
  const categoryForm = useForm({
    resolver: zodResolver(AddCategoryBody),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  useEffect(() => {
    categoryForm.reset(category);
  }, [category]);

  const saveCategory = async (data: AddCategoryBodyType) => {
    console.log(data);
    try {
      if (isEdit) {
        await categoryApiRequest.update(category?._id || "", data);
      } else {
        await categoryApiRequest.add(data);
      }
      loadCategoryList();
      onClose();
      categoryForm.reset({ name: "", active: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create new"} category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Form {...categoryForm}>
            <form
              className="p-4 rounded-lg bg-gray-100"
              onSubmit={categoryForm.handleSubmit((data) => {
                saveCategory(data);
              })}
            >
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Category Name</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="Enter category name"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <div className="my-4 border-t bg-gray-400"></div>
              <FormField
                control={categoryForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Category Active</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <RadioItem
                            value="true"
                            label="Active"
                            checked={field.value === true}
                            onChange={() => field.onChange(true)}
                          />
                        </div>
                        <div className="flex-1">
                          <RadioItem
                            value="false"
                            label="Deactive"
                            checked={field.value === false}
                            onChange={() => field.onChange(false)}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm"
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
