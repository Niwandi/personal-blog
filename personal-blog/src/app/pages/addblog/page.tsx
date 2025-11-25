"use client"
import Image from 'next/image'
import styles from './page.module.css'
import Navbar from '@/components/Navbar/Navbar'
import './addblog.css'
import { useEffect, useState } from 'react'
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import ClockLoader from "react-spinners/ClockLoader";

interface ParagraphData {
  title: string;
  description: string;
  image: File | null;
  imageUrl: string;
  position: string;
  createdAt: number | null;
}
interface FormData {
  title: string;
  description: string;
  image: File | null;
  imageUrl: string;
  paragraphs: ParagraphData[];
  category: string;
}

export default function AddBlog() {
  const [loading, setLoading] = useState(false);

  // ✅ Fixed checkLogin with async/await inside useEffect
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const response = await res.json();
        if (!response.ok) {
          window.location.href = "/pages/auth/signin";
        }
      } catch {
        window.location.href = "/pages/auth/signin";
      }
    };

    checkLogin();
  }, []);

  const [blog, setBlog] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    paragraphs: [],
    category: '',
  });

  const [categories, setCategories] = useState<string[]>([]);

  const getCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blogcategories`)
      .then((res) => res.json())
      .then((response) => {
        setCategories(response.categories);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getCategories();
  }, []);

  const [paragraphForm, setParagraphForm] = useState<ParagraphData>({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    position: '',
    createdAt: null
  });

  const pushParagraphToBlog = () => {
    const newParagraph = {
      ...paragraphForm,
      createdAt: new Date().getTime()
    };

    setBlog((prevBlog) => ({
      ...prevBlog,
      paragraphs: [...prevBlog.paragraphs, newParagraph]
    }));

    const nextPosition = String(parseInt(paragraphForm.position || "0") + 1);

    setParagraphForm({
      title: '',
      description: '',
      image: null,
      imageUrl: '',
      position: nextPosition,
      createdAt: null
    });
  };

  const deleteParagraph = (paragraph: ParagraphData) => {
    setBlog({
      ...blog,
      paragraphs: blog.paragraphs.filter((p) => p.createdAt !== paragraph.createdAt),
    });
  };

  const sortParagraphs = (a: ParagraphData, b: ParagraphData) => {
    if (a.position === b.position) {
      return b.createdAt! - a.createdAt!;
    }
    return a.position.localeCompare(b.position);
  };

  const uploadImage = async (image: File) => {
    try {
      const formData = new FormData();
      formData.append('myimage', image);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const uploadBLog = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const response = await res.json();
      if (!response.ok) {
        window.location.href = "/pages/auth/signin";
        return;
      }
    } catch {
      window.location.href = "/pages/auth/signin";
      return;
    }

    if (!blog.title || !blog.description || !blog.category) {
      toast("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // deep copy
    const tempblog: FormData = JSON.parse(JSON.stringify(blog));

    // Upload main blog image
    if (blog.image) {
      const imgUrl = await uploadImage(blog.image);
      tempblog.imageUrl = imgUrl ?? "";
    }

    // Upload paragraph images
    for (let i = 0; i < tempblog.paragraphs.length; i++) {
      const p = tempblog.paragraphs[i];
      if (p.image) {
        const imgURL = await uploadImage(p.image);
        tempblog.paragraphs[i].imageUrl = imgURL ?? "";
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tempblog),
      credentials: 'include'
    });

    if (response.ok) {
      toast('Blog post created successfully');
      setLoading(false);
    } else {
      toast('Failed to create the blog post');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(blog)
  }, [blog]);

  return (
    <div>
      {loading &&
        <div className='loaderfullpage'>
          <ClockLoader color="#36d7b7" loading={loading} size={150} />
        </div>
      }

      <Navbar />

      <div className='addblog_in'>
        {/* YOUR UI FORM – UNCHANGED */}
        {/* (Code continues exactly same...) */}
      </div>
    </div>
  );
}
