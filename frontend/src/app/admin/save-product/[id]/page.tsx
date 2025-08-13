/* eslint-disable @next/next/no-img-element */
"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  UnderlineIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Gender, ProductBody, ProductBodyType } from "@/schemas/product.schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageContainer from "@/app/admin/save-product/[id]/components/image-container";
import CategoryContainer from "@/app/admin/save-product/[id]/components/category-container";
import VariantContainer from "@/app/admin/save-product/[id]/components/variant-container";
import { handleErrorApi } from "@/lib/error";
import { productApiRequest } from "@/api-requests/product";
import { useParams, useRouter } from "next/navigation";

export default function SaveProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string | undefined }>();
  const [isEdit, setIsEdit] = useState(false);
  const productId = params.id;
  const [isLoaded, setIsLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    resolver: zodResolver(ProductBody),
    defaultValues: {
      name: "",
      description: "",
      gender: Gender.UNISEX,
      images: [],
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type something...",
      }),
      Underline,
      ListItem,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML(), { shouldValidate: true });
    },
    immediatelyRender: false,
  });

  const { control, setValue, reset, watch } = form;

  const loadProduct = async () => {
    const productId = params.id;
    if (!productId || productId == "null") return;
    setIsEdit(true);
    try {
      const findOneRsp = await productApiRequest.findOne(productId);
      if (!findOneRsp) router.push("/admin/save-product/null");
      const product = findOneRsp.payload;
      reset(product);
      setIsLoaded(true);
    } catch {
      router.push("/admin/save-product/null");
    }
  };

  useEffect(() => {
    loadProduct();
  }, [params]);

  useEffect(() => {
    if (editor && isLoaded) {
      const desc = form.getValues("description");
      if (desc) {
        editor.commands.setContent(desc);
      }
    }
  }, [editor, isLoaded]);

  const handleAddImage = (url: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, url]);
  };

  const handleRemoveImage = (url: string) => {
    const currentImages = form.getValues("images") || [];
    const index = currentImages?.lastIndexOf(url);
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
  };

  const handleReplaceImage = (oldUrl: string, newUrl: string) => {
    const currentImages = form.getValues("images") || [];
    const index = currentImages?.lastIndexOf(oldUrl);
    if (index === -1 || index === undefined) return;

    const newImages = [...currentImages];
    newImages[index] = newUrl;
    form.setValue("images", newImages);
  };

  const price = useWatch({ control, name: "price" });
  const discount = useWatch({ control, name: "discount" });
  const rawPriceAfterDiscount =
    price && discount ? price - (price * discount) / 100 : price;

  const priceAfterDiscount = rawPriceAfterDiscount
    ? Number(rawPriceAfterDiscount.toFixed(2))
    : 0;
  const formatNumberWithDots = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      useGrouping: true,
      maximumFractionDigits: 0,
    }).format(value);

  const onSubmit = async (data: ProductBodyType) => {
    console.log("submit", data)
    try {
      if (isEdit && productId) productApiRequest.update(productId, data);
      else await productApiRequest.add(data);

      router.push("/admin/product-list");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
      console.log(error);
    }
  };

  const saveDraft = () => {
    console.log(form.getValues());
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) {
      return;
    }
    const fileArray = Array.from(selectedFiles);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );
    const file = imageFiles[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Lỗi", {
        duration: 3000,
        description: "Image size exceeds 2MB. Please select a smaller image.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      const uploadRsp = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadRsp.payload.imageUrl;
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-8 py-8 flex flex-col items-center"
      >
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">
              {isEdit ? "Update" : "Add New"} Product
            </p>
            <div className="flex items-stretch gap-2">
              <button
                onClick={() => {
                  saveDraft();
                }}
                className="cursor-pointer px-4 py-2 rounded-lg border-2 border-gray-300 text-black font-medium text-sm"
                type="button"
              >
                Draft
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm"
                type="submit"
              >
                {isEdit ? "Update" : "Add"} Product
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-4 items-stretch h-full">
            <div className="w-full md:w-3/5 space-y-6">
              {/* General Infomation */}
              <div className="space-y-2">
                <p className="text-base font-medium">General Information</p>
                <div className="bg-gray-50 p-4 border-2 border-gray-200 rounded-md space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-gray-600">
                          Product name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-gray-300 bg-gray-200"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={() => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-gray-600">
                          Description
                        </FormLabel>
                        <div>
                          <div className="mt-1 flex items-center gap-2 p-1 border border-gray-300 rounded-t-lg bg-gray-50 text-gray-600">
                            <button
                              type="button"
                              onClick={() =>
                                editor?.chain().focus().toggleBold().run()
                              }
                              className={`p-2 rounded hover:bg-gray-200 ${
                                editor?.isActive("bold") ? "bg-blue-200" : ""
                              }`}
                            >
                              <Bold size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                editor?.chain().focus().toggleItalic().run()
                              }
                              className={`p-2 rounded hover:bg-gray-200 ${
                                editor?.isActive("italic") ? "bg-blue-200" : ""
                              }`}
                            >
                              <Italic size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                editor?.chain().focus().toggleUnderline().run()
                              }
                              className={`p-2 rounded hover:bg-gray-200 ${
                                editor?.isActive("underline")
                                  ? "bg-blue-200"
                                  : ""
                              }`}
                            >
                              <UnderlineIcon size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                editor?.chain().focus().toggleBulletList().run()
                              }
                              className={`p-2 rounded hover:bg-gray-200 ${
                                editor?.isActive("bulletList")
                                  ? "bg-blue-200"
                                  : ""
                              }`}
                            >
                              <List size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleOrderedList()
                                  .run()
                              }
                              className={`p-2 rounded hover:bg-gray-200 ${
                                editor?.isActive("orderedList")
                                  ? "bg-blue-200"
                                  : ""
                              }`}
                            >
                              <ListOrdered size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 rounded hover:bg-gray-200"
                            >
                              <ImageIcon size={16} />
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>

                          <div
                            className={`flex-1 bg-gray-200 h-48 border border-gray-300 rounded-b-lg relative overflow-y-auto`}
                          >
                            {watch("description")?.length === 0 && (
                              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                                Type something...
                              </div>
                            )}

                            <EditorContent
                              editor={editor}
                              onClick={() => editor?.commands.focus()}
                              className="h-full max-h-full px-4 py-2 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none
                                [&_p]:my-2
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2
                                [&_strong]:font-bold
                                [&_em]:italic
                                [&_ul]:list-disc [&_ul]:pl-6
                                [&_ol]:list-decimal [&_ol]:pl-6
                                [&_li]:my-1"
                            />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-1 mt-6 flex items-center gap-8">
                        <FormLabel className="mb-0 text-gray-600 leading-none">
                          Gender
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex items-center gap-6"
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value={Gender.MALE} />
                              </FormControl>
                              <FormLabel className="font-normal leading-none">
                                Men
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value={Gender.FEMALE} />
                              </FormControl>
                              <FormLabel className="font-normal leading-none">
                                Women
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value={Gender.UNISEX} />
                              </FormControl>
                              <FormLabel className="font-normal leading-none">
                                Unisex
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Price and stock */}
              <div className="space-y-2">
                <p className="text-base font-medium">Price And Stock</p>
                <div className="bg-gray-50 p-4 border-2 border-gray-200 rounded-md space-y-4">
                  <div className="flex flex-col gap-6 md:flex-row items-start md:gap-3">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/2 space-y-1">
                          <FormLabel className="text-gray-600">Price</FormLabel>

                          <div className="relative">
                            <FormControl>
                              <Input
                                className="bg-gray-200"
                                placeholder="Enter product price"
                                value={
                                  field.value
                                    ? new Intl.NumberFormat("vi-VN").format(
                                        field.value
                                      )
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
                            </FormControl>
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-gray-500 text-white text-sm rounded">
                              đ
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/2 space-y-1">
                          <FormLabel className="text-gray-600">Stock</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-gray-200"
                              type="number"
                              placeholder="Enter product stock"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="items-start mt-0 md:mt-6 flex flex-col gap-6 md:flex-row md:gap-3">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="w-full md:1/2 space-y-1">
                          <FormLabel className="text-gray-600">
                            Discount
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-gray-200"
                              placeholder="Enter discount"
                              value={
                                field.value !== undefined
                                  ? `${field.value}%`
                                  : ""
                              }
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                field.onChange(
                                  raw ? parseInt(raw, 10) : undefined
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full md:1/2 space-y-1">
                      <FormLabel>Price After Discount</FormLabel>
                      <div className="relative">
                        <Input
                          className="mt-3 pr-10 bg-gray-200"
                          placeholder="Enter product stock"
                          readOnly
                          value={formatNumberWithDots(priceAfterDiscount)}
                        />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-gray-500 text-white text-sm rounded">
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-base font-medium">Variants</p>
                <VariantContainer form={form} />
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-2/5 space-y-6">
              <div className="space-y-2">
                <p className="text-base font-medium">Product Images</p>
                <ImageContainer
                  images={watch("images")}
                  handleAddImage={handleAddImage}
                  handleRemoveImage={handleRemoveImage}
                  handleReplaceImage={handleReplaceImage}
                />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">Category</p>
                <CategoryContainer form={form} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
