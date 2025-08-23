"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
/* eslint-disable @next/next/no-img-element */
import {
  ProductWithCategoryType,
  StockBody,
  StockBodyType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import EditableCell from "@/components/editable-cell";
import { handleErrorApi } from "@/lib/error";
import { productApiRequest } from "@/api-requests/product";
import { toast } from "sonner";
interface ProductDetailProps {
  product: ProductWithCategoryType;
  loadProducts: () => void;
}
export default function ProductDetail({
  product,
  loadProducts,
}: ProductDetailProps) {
  const form = useForm<StockBodyType>({
    resolver: zodResolver(StockBody),
    defaultValues: {
      variants: product.variants,
    },
  });
  const { control, watch, setValue } = form;
  const { fields: variantFields } = useFieldArray({
    control: control,
    name: "variants",
  });
  const updateStoke = async () => {
    try {
      await productApiRequest.updateStock(product._id, form.getValues());
      loadProducts();
      toast.success("Success", {
        description: "Update stock success",
        duration: 3000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col gap-2 md:flex-row md:gap-6">
          <img
            src={product.images.length > 0 ? product.images[0] : ""}
            alt=""
            className="w-40 h-40 object-cover rounded-lg"
          />
          <Table className="text-gray-500">
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="font-normal text-gray-600 tracking-wider pl-4 rounded-tl-md rounded-bl-md">
                  Variants
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider">
                  Price
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider rounded-tr-md rounded-br-md">
                  Stock
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-base">
              {variantFields.map((field, index) => {
                return (
                  <TableRow key={field.id}>
                    <TableCell className="pl-4 flex items-center gap-2 text-black">
                      <p>
                        {field.attributes.reduce((sum, item, index) => {
                          if (index === 0) return sum + item.option;
                          else return sum + " / " + item.option;
                        }, "")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        type="number"
                        value={
                          watch(`variants.${index}.price`)?.toLocaleString(
                            "vi-VN"
                          ) ?? ""
                        }
                        onChange={(val) => {
                          const raw = Number(val.replace(/\./g, ""));
                          setValue(`variants.${index}.price`, raw);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        type="number"
                        value={String(
                          watch(`variants.${index}.quantity`) ?? ""
                        )}
                        onChange={(val) =>
                          setValue(`variants.${index}.quantity`, Number(val))
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => updateStoke()}
            type="submit"
            className="cursor-pointer w-full md:w-auto text-sm leading-0 p-4 rounded-md px-4 bg-blue-600 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
