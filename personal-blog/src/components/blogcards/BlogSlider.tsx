import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import BlogCard from './BlogCard';

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

const BlogSlider = () => {

  const blogs = [
        {
            name: "blog 1",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 2",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 3",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 4",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 5",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 6",
            path: "#",
            bgcolor: "black"
        },
        {
            name: "blog 7",
            path: "#",
            bgcolor: "black"
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
        blogs.map((blog)=>{
            return(
                // eslint-disable-next-line react/jsx-key
                <SwiperSlide>
                    <BlogCard {...blog} />
                </SwiperSlide>
            )
        } )
       }
      </Swiper>
    </div>
  )
}

export default BlogSlider
