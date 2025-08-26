import { SearchOrderBodyType } from "@/types/order.type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { UseFormReturn } from "react-hook-form";
interface SearchContainerProps {
  searchOrderForm: UseFormReturn<SearchOrderBodyType>;
  fetchOrder: () => void;
}
export default function SearchContainer({
  fetchOrder,
  searchOrderForm,
}: SearchContainerProps) {
  return (
    <Form {...searchOrderForm}>
      <form
        onSubmit={searchOrderForm.handleSubmit(fetchOrder)}
        className="space-y-6"
      >
        <p className="text-center uppercase font-bold text-2xl">Search order</p>
        <div className="space-y-4">
          <FormField
            control={searchOrderForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Code</FormLabel>
                <FormControl>
                  <div className="p-2 px-4 border-2 border-black">
                    <input
                      placeholder="Enter order code"
                      className="w-full text-base outline-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={searchOrderForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="p-2 px-4 border-2 border-black">
                    <input
                      placeholder="Contact phone number for the order"
                      className="w-full text-base outline-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full text-center p-2 font-medium text-white bg-black"
        >
          Search
        </button>
      </form>
    </Form>
  );
}
