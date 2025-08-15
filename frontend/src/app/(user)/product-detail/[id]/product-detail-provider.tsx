"use client";
import {
  createContext,
  useContext,
  useState,
} from "react";

const ProductDetailContext = createContext<{
  selectedImage?: string;
  setSelectedImage: (image?: string) => void;
}>({
  setSelectedImage: () => {},
});
export const useProductDetailContext = () => {
  const context = useContext(ProductDetailContext);
  return context;
};
export default function ProductDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  return (
    <ProductDetailContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
    </ProductDetailContext.Provider>
  );
}
