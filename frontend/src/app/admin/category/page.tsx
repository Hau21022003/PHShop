"use client";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { CategoryType } from "@/schemas/category.schema";
import { handleErrorApi } from "@/lib/error";
import { categoryApiRequest } from "@/api-requests/category";
import { formatDateShort } from "@/utils/time";
import SaveCategoryDialog from "@/app/admin/category/components/save-category";
import { closeLoading, showLoading } from "@/components/loading-overlay";

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "active" | "deactive" | "all"
  >("all");
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [saveDialogState, setSaveDialogState] = useState<{
    open: boolean;
    isEdit: boolean;
    category?: CategoryType;
  }>({ open: false, isEdit: false });

  const handleOpenDialog = (mode: "edit" | "add", category?: CategoryType) => {
    setSaveDialogState({ open: true, isEdit: mode === "edit", category });
  };
  const handleCloseDialog = () => {
    setSaveDialogState({ open: false, isEdit: false, category: undefined });
  };

  const loadCategoryList = async () => {
    showLoading();
    try {
      const rsp = await categoryApiRequest.findAll({
        search: search,
        status: activeFilter,
      });
      setCategoryList(rsp.payload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      closeLoading();
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      await categoryApiRequest.delete(categoryId);
      loadCategoryList();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    loadCategoryList();
  }, [search, activeFilter]);

  return (
    <div className="px-8 py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          {/* Left */}
          <div className="flex md:items-center gap-4 w-full">
            <div className="w-full md:w-auto flex items-center gap-2 border-2 border-gray-300 rounded-md p-2 px-4">
              <Search className="w-5 h-5 stroke-2 text-black" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="flex-1 border-none bg-transparent focus:outline-none w-full"
              />
            </div>
            <p>
              <span>{categoryList.length}</span>{" "}
              <span className="text-gray-400">items</span>
            </p>
          </div>
          {/* Right */}
          <div className="flex gap-2 items-stretch">
            <div className="w-auto flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFilter("all")}
                className={`cursor-pointer py-2 px-3 leading-none whitespace-nowrap ${
                  activeFilter === "all" ? "bg-gray-200" : ""
                }`}
              >
                View all
              </button>
              <div className="border-l border-gray-300"></div>
              <button
                onClick={() => setActiveFilter("active")}
                className={`cursor-pointer py-2 px-3 leading-none whitespace-nowrap ${
                  activeFilter === "active" ? "bg-gray-200" : ""
                }`}
              >
                Active
              </button>
              <div className="border-l border-gray-300"></div>
              <button
                onClick={() => setActiveFilter("deactive")}
                className={`cursor-pointer py-2 px-3 leading-none whitespace-nowrap ${
                  activeFilter === "deactive" ? "bg-gray-200" : ""
                }`}
              >
                Deactive
              </button>
            </div>
            <button
              onClick={() => handleOpenDialog("add")}
              className="p-2 px-3 cursor-pointer flex items-center justify-center gap-2 text-white bg-blue-600 rounded-md"
            >
              <Plus className="w-5 h-5" />
              <p className="whitespace-nowrap leading-0">Add Category</p>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-2 bg-gray-50 rounded-lg">
          <Table className="text-gray-500 overflow-hidden border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-200 border-none">
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase pl-4 rounded-tl-md rounded-bl-md">
                  Category
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase hidden sm:table-cell">
                  Created day
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase hidden md:table-cell">
                  Item quantity
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase">
                  Status
                </TableHead>
                <TableHead className="font-normal text-gray-600 tracking-wider uppercase rounded-tr-md rounded-br-md"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-base">
              {categoryList.map((category) => (
                <TableRow
                  key={category._id}
                  className={`py-4 border-b border-gray-200`}
                >
                  <TableCell className="py-4 pl-4 text-black">
                    <p className="truncate">{category.name}</p>
                    <div className="space-y-1 sm:hidden mt-1">
                      <p className="text-sm text-gray-500">
                        Quantity: {category.productQuantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created date: {formatDateShort(category.createdAt)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 hidden sm:table-cell">
                    {formatDateShort(category.createdAt)}
                  </TableCell>
                  <TableCell className="py-4 hidden md:table-cell">
                    {category.productQuantity}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          category.active ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <p className="leading-0">
                        {category.active ? "Active" : "Deactive"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-6">
                      <button className="w-8 h-8 items-center justify-center cursor-pointer rounded-lg flex gap-2 text-blue-600 group">
                        <p
                          onClick={() => handleOpenDialog("edit", category)}
                          className="font-medium group-hover:underline group-hover:underline-offset-4"
                        >
                          Edit
                        </p>
                      </button>
                      <button className="w-8 h-8 items-center justify-center cursor-pointer rounded-lg flex gap-2 text-red-600 group">
                        <p
                          onClick={() => removeCategory(category._id)}
                          className="font-medium group-hover:underline group-hover:underline-offset-4"
                        >
                          Remove
                        </p>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <SaveCategoryDialog
          open={saveDialogState.open}
          isEdit={saveDialogState.isEdit}
          category={saveDialogState.category}
          loadCategoryList={loadCategoryList}
          onClose={handleCloseDialog}
        />
      </div>
    </div>
  );
}
