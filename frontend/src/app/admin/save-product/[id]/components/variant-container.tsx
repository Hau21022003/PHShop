/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductBodyType } from "@/schemas/product.schema";
import { EllipsisVertical, ImagePlus, PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EditableCell from "@/components/editable-cell";
import AddImageVariantDialog from "@/app/admin/save-product/[id]/components/add-image-variant";

interface VariantContainerProps {
  form: UseFormReturn<ProductBodyType>;
}

const VariantSchema = z.object({
  title: z.string().min(1, "Title not empty"),
  options: z.array(z.object({ option: z.string().min(1, "Option not empty") })),
});
type VariantType = z.TypeOf<typeof VariantSchema>;

interface VariantPair {
  title: string;
  option: string;
}
type VariantCombination = VariantPair[];

export default function VariantContainer({ form }: VariantContainerProps) {
  const [addImageDialogState, setAddImageDialogState] = useState<{
    open: boolean;
    variantIndex: number;
  }>({ open: false, variantIndex: -1 });

  const [variantDialogState, setVariantDialogState] = useState<{
    open: boolean;
    isEdit: boolean;
    editIndex?: number;
  }>({ isEdit: false, open: false });
  const { control, watch, setValue } = form;
  const { fields: variantFields, replace: variantReplace } = useFieldArray({
    control,
    name: "variants",
  });
  const { fields: variantStructure, replace: variantStructureReplace } =
    useFieldArray({
      control,
      name: "variantStructure",
    });
  const [variantList, setVariantList] = useState<VariantType[]>(
    variantStructure || []
  );
  useEffect(() => {
    setVariantList(variantStructure);
  }, [variantStructure]);

  const price = useWatch({ control, name: "price" });

  const variantForm = useForm<VariantType>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      title: "",
      options: [{ option: "" }],
    },
  });

  const {
    fields: variantOptionFields,
    append: variantOptionAppend,
    remove: variantOptionRemove,
  } = useFieldArray({
    control: variantForm.control,
    name: "options",
  });

  /**
   * Tạo tất cả các tổ hợp có thể từ danh sách variants
   * @param variants - Mảng các variant với title và options
   * @returns Mảng các tổ hợp variant
   */
  function generateVariantCombinations(
    variants: VariantType[]
  ): VariantCombination[] {
    // Kiểm tra input
    if (!variants || variants.length === 0) {
      return [];
    }

    /**
     * Hàm đệ quy để tạo tất cả các tổ hợp
     * @param variantIndex - Index của variant hiện tại
     * @param currentCombination - Tổ hợp hiện tại đang được xây dựng
     * @returns Mảng các tổ hợp hoàn chỉnh
     */
    function createCombinations(
      variantIndex: number,
      currentCombination: VariantPair[]
    ): VariantCombination[] {
      // Nếu đã xử lý hết tất cả variants
      if (variantIndex >= variants.length) {
        return [[...currentCombination]];
      }

      const currentVariant: VariantType = variants[variantIndex];
      const combinations: VariantCombination[] = [];

      // Duyệt qua tất cả options của variant hiện tại
      for (const option of currentVariant.options) {
        const newCombination: VariantPair[] = [
          ...currentCombination,
          { title: currentVariant.title, option: option.option },
        ];

        // Đệ quy để xử lý variant tiếp theo
        const nextCombinations: VariantCombination[] = createCombinations(
          variantIndex + 1,
          newCombination
        );
        combinations.push(...nextCombinations);
      }

      return combinations;
    }

    return createCombinations(0, []);
  }

  const saveVariant = (data: VariantType) => {
    let newVariantList = [];
    if (
      variantDialogState.isEdit &&
      variantDialogState.editIndex !== undefined
    ) {
      newVariantList = [...variantList];
      newVariantList[variantDialogState.editIndex] = data;
    } else {
      newVariantList = [...variantList, data];
    }
    // const newVariantList = [...variantList, data];
    // setVariantList(newVariantList);
    variantStructureReplace(newVariantList);

    const variantCombinations = generateVariantCombinations(newVariantList);
    // console.log("variantCombinations", variantCombinations);
    const newFormVariants: ProductBodyType["variants"] =
      variantCombinations.map((item) => ({
        attributes: item,
        price: price || 0,
        quantity: 0,
      }));
    variantReplace(newFormVariants || []);

    handleCloseDialog();
  };

  // Test
  useEffect(() => {
    console.log("fields", variantFields);
    console.log("form", form.getValues());
  }, [variantFields, form]);

  const handleOpenDialog = (mode?: "open" | "edit", editIndex?: number) => {
    setVariantDialogState({ open: true, isEdit: mode === "edit", editIndex });
    if (mode == "edit" && editIndex !== undefined) {
      const variant = variantList[editIndex];
      variantForm.reset(variant);
    }
  };

  const handleCloseDialog = () => {
    setVariantDialogState({ open: false, isEdit: false });
    variantForm.reset({
      title: "",
      options: [{ option: "" }],
    });
  };

  const removeVariant = (index: number) => {
    const newVariantList = variantList.filter((_, i) => i !== index);
    setVariantList(newVariantList);
    variantStructureReplace(newVariantList);

    const variantCombinations = generateVariantCombinations(newVariantList);
    // console.log("variantCombinations", variantCombinations);
    const newFormVariants: ProductBodyType["variants"] =
      variantCombinations.map((item) => ({
        attributes: item,
        price: price || 0,
        quantity: 0,
      }));
    variantReplace(newFormVariants || []);
  };

  return (
    <div className="p-4 border-2 bg-gray-50 border-gray-200 rounded-md space-y-4">
      <div className="flex justify-between">
        <FormLabel>Product Variants</FormLabel>
        <button
          onClick={() => handleOpenDialog("open")}
          type="button"
          className="flex items-center gap-1 text-blue-600 cursor-pointer"
        >
          <PlusIcon className="w-5 h-5 stroke-2" />
          <p className="text-sm leading-none font-medium">Add Variant</p>
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-gray-500">Variant name</p>
        {variantList.map((variant, index) => (
          <div key={`variant_item_${index}`} className="flex items-start gap-2">
            <div className="flex-1 flex gap-2 rounded-md border-2 border-gray-300 px-4 py-1">
              <div className="flex items-center w-32">
                <p title={variant.title} className="truncate">
                  {variant.title}
                </p>
              </div>
              <div className="flex gap-2 flex-row flex-wrap">
                {variant.options.map((option, optionIndex) => (
                  <div
                    key={`variant_item_${index} option_${optionIndex}`}
                    className="py-1 px-2 rounded-lg bg-gray-300 truncate max-w-60"
                  >
                    {option.option}
                  </div>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="cursor-pointer p-[10px] rounded-md border-2 border-gray-300">
                  <EllipsisVertical className="w-5 h-5 text-gray-500" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleOpenDialog("edit", index)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    removeVariant(index);
                  }}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <div className="border-t-1 border-gray-300"></div>
      <Table className="text-gray-500">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-500">Variants</TableHead>
            <TableHead className="text-gray-500">Price</TableHead>
            <TableHead className="text-gray-500">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {variantFields.map((field, index) => {
            const image = watch(`variants.${index}.image`);
            return (
              <TableRow key={field.id}>
                <TableCell className="flex items-center gap-2 text-black">
                  {/* Input image */}
                  <button
                    type="button"
                    className="cursor-pointer relative group"
                    // onClick={() => fileInputRef.current?.click()}
                    onClick={() =>
                      setAddImageDialogState({
                        open: true,
                        variantIndex: index,
                      })
                    }
                  >
                    {image && (
                      <div className="relative w-10 h-10">
                        <img
                          className="w-full h-full rounded-md object-cover"
                          src={image}
                          alt=""
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImagePlus className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    {!image && (
                      <div className="w-10 h-10 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
                        <ImagePlus className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </button>
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
                    value={String(watch(`variants.${index}.quantity`) ?? "")}
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
      <Dialog
        open={variantDialogState.open}
        onOpenChange={() => {
          handleCloseDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
          <p className="text-xl font-bold">
            {variantDialogState.isEdit ? "Edit" : "Add"} Variant
          </p>
          <Form {...variantForm}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                variantForm.handleSubmit(saveVariant)(e);
              }}
            >
              <FormField
                control={variantForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-600">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter variant title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center mt-4">
                <FormLabel className="text-gray-600">Options</FormLabel>
                <button
                  onClick={() => variantOptionAppend({ option: "" })}
                  type="button"
                  className="mt-2 flex items-center gap-1 text-blue-600 cursor-pointer"
                >
                  <PlusIcon className="w-5 h-5 stroke-2" />
                  <p className="text-sm font-medium">Add Option</p>
                </button>
              </div>
              {variantOptionFields.map((field, index) => (
                <div key={field.id} className="space-y-2 mt-2">
                  <div className="flex gap-2 items-stretch">
                    <Input
                      placeholder="Enter option"
                      {...variantForm.register(`options.${index}.option`)}
                    />
                    <button
                      type="button"
                      className="border border-gray-300 px-2 rounded-md"
                      onClick={() => variantOptionRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                  {variantForm.formState.errors.options?.[index]?.option && (
                    <p className="text-sm text-red-500">
                      {
                        variantForm.formState.errors.options[index].option
                          ?.message
                      }
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm">
                  Submit
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AddImageVariantDialog
        open={addImageDialogState.open}
        onClose={() =>
          setAddImageDialogState({ open: false, variantIndex: -1 })
        }
        form={form}
        variantIndex={addImageDialogState.variantIndex}
      />
    </div>
  );
}
