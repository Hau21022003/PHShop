"use client";
import { provinceApiRequest } from "@/api-requests/province";
import { Combobox } from "@/app/(user)/checkout/components/combobox";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { handleErrorApi } from "@/lib/error";
import { CreateOrderType } from "@/schemas/order.schema";
import {
  DistrictType,
  ProvinceType,
  WardType,
} from "@/schemas/province.schema";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface ContactDetailProps {
  orderForm: UseFormReturn<CreateOrderType>;
}

export default function ContactDetail({ orderForm }: ContactDetailProps) {
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [wards, setWards] = useState<WardType[]>([]);
  const [activeStep, setActiveStep] = useState<
    "province" | "district" | "ward" | null
  >(null);

  const loadProvinces = async () => {
    try {
      const provinces = (await provinceApiRequest.getProvinces()).payload;
      setProvinces(provinces);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    const contactDetails = orderForm.watch("contactDetails");
    if (contactDetails?.province && districts.length === 0) loadDistricts();
    if (contactDetails?.district && wards.length === 0) loadWards();
  }, [orderForm.watch("contactDetails")]);

  const loadDistricts = async () => {
    const province = orderForm.watch("contactDetails.province");
    try {
      const districts = (await provinceApiRequest.getDistrict(province))
        .payload;
      setDistricts(districts);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const loadWards = async () => {
    const district = orderForm.watch("contactDetails.district");
    try {
      const wards = (await provinceApiRequest.getWards(district)).payload;
      setWards(wards);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10 sm:items-start">
        <FormField
          control={orderForm.control}
          name="contactDetails.fullName"
          render={({ field }) => (
            <FormItem className="sm:flex-1 w-full space-y-1">
              <FormLabel>Full Name</FormLabel>
              <div className="py-2 border-b-2 border-black">
                <input
                  className="w-full bg-transparent outline-none text-base"
                  placeholder="Enter your full name"
                  {...field}
                />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={orderForm.control}
          name="contactDetails.phoneNumber"
          render={({ field }) => (
            <FormItem className="sm:flex-1 w-full space-y-1">
              <FormLabel>Phone Number</FormLabel>
              <div className="py-2 border-b-2 border-black">
                <input
                  className="w-full bg-transparent outline-none text-base"
                  placeholder="Enter your phone number"
                  {...field}
                />
              </div>
            </FormItem>
          )}
        />
      </div>
      {/* Province */}
      <FormField
        control={orderForm.control}
        name="contactDetails.ward"
        render={() => (
          <FormItem className="sm:flex-1 w-full space-y-1">
            <FormLabel>Province / District / Ward</FormLabel>

            <div
              onClick={() => {
                if (!orderForm.watch("contactDetails.province")) {
                  setActiveStep("province");
                } else if (!orderForm.watch("contactDetails.district")) {
                  setActiveStep("district");
                } else if (!orderForm.watch("contactDetails.ward")) {
                  setActiveStep("ward");
                }
              }}
              className="flex gap-2 py-2 border-b-2 border-black"
            >
              <FormField
                control={orderForm.control}
                name="contactDetails.province"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={(val) => {
                          orderForm.setValue("contactDetails.province", val);
                          loadDistricts();
                          setWards([]);
                          orderForm.resetField("contactDetails.district");
                          orderForm.resetField("contactDetails.ward");
                        }}
                        options={provinces.map((province) => ({
                          label: province.name,
                          value: province.idProvince,
                        }))}
                        placeholder="Province"
                        open={activeStep === "province"}
                        onOpenChange={(open) => {
                          if (open) setActiveStep("province");
                          else {
                            if (orderForm.watch("contactDetails.province"))
                              setActiveStep("district");
                            else setActiveStep(null);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <p className="text-gray-300">/</p>

              <FormField
                control={orderForm.control}
                name="contactDetails.district"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={(val) => {
                          orderForm.setValue("contactDetails.district", val);
                          loadWards();
                          orderForm.resetField("contactDetails.ward");
                        }}
                        options={districts.map((district) => ({
                          label: district.name,
                          value: district.idDistrict,
                        }))}
                        placeholder="District"
                        open={activeStep === "district"}
                        onOpenChange={(open) => {
                          if (open) setActiveStep("district");
                          else if (orderForm.watch("contactDetails.district"))
                            setActiveStep("ward");
                          else setActiveStep(null);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <p className="text-gray-300">/</p>

              <FormField
                control={orderForm.control}
                name="contactDetails.ward"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Combobox
                        value={field.value}
                        onChange={(val) =>
                          orderForm.setValue("contactDetails.ward", val)
                        }
                        options={wards.map((ward) => ({
                          label: ward.name,
                          value: ward.idCommune,
                        }))}
                        placeholder="Ward"
                        open={activeStep === "ward"}
                        onOpenChange={(open) => {
                          if (open) setActiveStep("ward");
                          else setActiveStep(null);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormItem>
        )}
      />
      {/* Address */}
      <FormField
        control={orderForm.control}
        name="contactDetails.address"
        render={({ field }) => (
          <FormItem className="sm:flex-1 w-full space-y-1">
            <FormLabel>Address</FormLabel>
            <div className="py-2 border-b-2 border-black">
              <input
                className="w-full bg-transparent outline-none text-base"
                placeholder="e.g., 123 Nguyen Trai Street"
                {...field}
              />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={orderForm.control}
        name="note"
        render={({ field }) => (
          <FormItem className="sm:flex-1 w-full space-y-1">
            <FormLabel>Note</FormLabel>
            <div className="py-2 border-b-2 border-black">
              <input
                className="w-full bg-transparent outline-none text-base"
                placeholder="e.g., Deliver during office hours..."
                {...field}
              />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
