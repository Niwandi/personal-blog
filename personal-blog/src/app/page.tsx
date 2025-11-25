'use client'
import BlogSlider from "@/components/blogcards/BlogSlider";
import CategoriesSlider from "@/components/Categories/CategoriesSlider";
import HomeSlider from "@/components/HomeSlider/HomeSlider";
import Navbar from "@/components/Navbar/Navbar";
export default function Home() {
  return (
      <main>
        <Navbar/>
        <HomeSlider />
        <CategoriesSlider />
        <BlogSlider />
       <h1>--Footer--</h1>
      </main>
   
  );
}
