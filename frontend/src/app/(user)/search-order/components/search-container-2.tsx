import { SearchOrderBodyType } from "@/types/order.type";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FileText, Phone, Search } from "lucide-react";
interface SearchContainerProps {
  searchOrderForm: UseFormReturn<SearchOrderBodyType>;
  fetchOrder: () => void;
}
export default function SearchContainer2({
  fetchOrder,
  searchOrderForm,
}: SearchContainerProps) {
  return (
    <Form {...searchOrderForm}>
      <form
        onSubmit={searchOrderForm.handleSubmit(fetchOrder)}
        className="flex gap-2 items-start"
      >
        <FormField
          control={searchOrderForm.control}
          name="code"
          render={({ field, fieldState }) => (
            <FormItem className="sm:w-64">
              <FormControl>
                <div
                  className={`h-12 px-4 border-2 flex items-center gap-2 ${
                    fieldState.error ? "border-red-500" : "border-black"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <input
                    placeholder="Enter order code"
                    className="w-full text-base outline-none"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={searchOrderForm.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <FormItem className="sm:w-64">
              <FormControl>
                <div
                  className={`h-12 px-4 border-2 flex items-center gap-2 ${
                    fieldState.error ? "border-red-500" : "border-black"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <input
                    placeholder="Contact phone number"
                    className="w-full text-base outline-none"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="cursor-pointer h-12 px-4 text-center font-medium text-white bg-black"
        >
          <p className="hidden sm:block">Search</p>
          <Search className="w-5 h-5 sm:hidden" />
        </button>
      </form>
    </Form>
  );
}
