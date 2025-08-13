"use client";
import { categoryApiRequest } from "@/api-requests/category";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { handleErrorApi } from "@/lib/error";
import {
  AddCategoryBody,
  AddCategoryBodyType,
  CategoryType,
} from "@/schemas/category.schema";
import { ProductBodyType } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface CategoryContainerProps {
  form: UseFormReturn<ProductBodyType>;
}

export default function CategoryContainer({ form }: CategoryContainerProps) {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const loadCategory = async () => {
    try {
      const findAllRsp = await categoryApiRequest.findAll();
      setCategoryList(findAllRsp.payload);
      // if (findAllRsp.payload.length) {
      //   form.setValue("category", form.getValues("category"));
      // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  useEffect(() => {
    loadCategory();
  }, []);
  const categoryForm = useForm({
    resolver: zodResolver(AddCategoryBody),
    defaultValues: {
      name: "",
      active: true,
    },
  });
  const addCategory = async (data: AddCategoryBodyType) => {
    try {
      await categoryApiRequest.add(data);
      loadCategory();
      toast.success("Success", {
        description: "Added new category",
        duration: 3000,
      });
      setIsAddCategoryOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  const categoryValue = form.watch("category");

  return (
    <div className="p-4 border-2 bg-gray-50 border-gray-200 rounded-md space-y-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Product Category</FormLabel>
            <Select
              key={categoryList.length}
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              disabled={categoryList.length === 0}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-gray-200">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoryList.map((data) => (
                  <SelectItem key={data._id} value={data._id.toString()}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <button
        onClick={() => {
          setIsAddCategoryOpen(true);
        }}
        type="button"
        className="p-2 px-4 font-medium text-sm cursor-pointer bg-blue-500 text-white rounded-md"
      >
        Add Category
      </button>
      <Dialog
        open={isAddCategoryOpen}
        onOpenChange={() => {
          setIsAddCategoryOpen(false);
        }}
      >
        <DialogContent className="flex flex-col">
          <p className="text-xl font-bold">Add Category</p>
          <Form {...categoryForm}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                categoryForm.handleSubmit(addCategory)(e);
              }}
            >
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-600">
                      Category Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-200"
                        placeholder="Enter category name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm">
                  Submit
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
