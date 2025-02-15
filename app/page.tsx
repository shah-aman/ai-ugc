import { Background } from "./components/background";
import { Header } from "./components/header";
import { ProductForm } from "./components/product-form";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center p-20">
      <Background />
      <Header />
      <ProductForm />
    </div>
  );
}
