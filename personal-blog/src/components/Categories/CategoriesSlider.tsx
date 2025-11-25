import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import CategoryCard from './CategoryCard';


const createHex = () => {
let hexCode1 = "";
const hexValues1 = "0123456789abcdef";

  for (let i = 0; i < 6; i++) {
    hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
  }
  return hexCode1;
};

const generate = () => {
const deg = Math.floor(Math.random() * 360);
  return `linear-gradient(${deg}deg, #${createHex()}, #${createHex()})`;
};

const CategoriesSlider = () => {

    const categories = [
        {
            name: "category 1",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 2",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 3",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 4",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 5",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 6",
            path: "#",
            bgcolor: generate()
        },
        {
            name: "category 7",
            path: "#",
            bgcolor: generate()
        },
    ]
  return (
    <div>
        <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          '@1.50': {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
       {
        categories.map((category)=>{
            return(
                // eslint-disable-next-line react/jsx-key
                <SwiperSlide>
                    <CategoryCard {...category} />
                </SwiperSlide>
            )
        } )
       }
      </Swiper>
    </div>
  )
}

export default CategoriesSlider