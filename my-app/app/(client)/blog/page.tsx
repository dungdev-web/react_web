'use client';
import "../style/blog.css";
import parse from 'html-react-parser';
import truncate from 'html-truncate';
import { useState,useEffect, JSX } from "react";
import { IBlog } from "../components/cautrucdata";
import { API_URL } from "../config/config";
import Link from "next/link";
import Image from "next/image";
export default function Blog() {
    const [blog,setBlog]=useState<IBlog[]>([]);
    const getTruncatedHTML = (html: string, limit: number = 120): JSX.Element => {
        // Truncate HTML giữ đúng cấu trúc, không gây lỗi
        const truncated = truncate(html, limit, { ellipsis: '...' });
        return <>{parse(truncated)}</>; // Không bọc trong <p> nếu đã có thẻ block bên trong
      };
    useEffect(() => {
        fetch(`${API_URL}/api/blog`)
        .then(response => response.json())
        .then(data => setBlog(data.blogs))
        }, []);
    return (
        <div>
            <section className="bread-crumb">
                <div className="container1 mx-auto max-w-6xl">
                    <div className="rows">
                        <div className="col-xs-12">

                            <div className="breadcrumb-title"><b> Tin tức </b></div>

                            <ul className="breadcrumb">

                                <li className="home">
                                    <Link href="/"><span>Trang chủ</span></Link>
                                    <span> / </span>
                                </li>


                                <li><strong><span> Tin tức</span></strong></li>


                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div>
            <div className="container1 mx-auto ">
                <div className="row">
                    <aside className="left left-content col-md-3 col-md-pull-9">

                        <aside className="blog-aside aside-item sidebar-category blog-category">
                            <div className="aside-title">
                                <h2 className="title-head"><span>Danh mục tin</span></h2>
                            </div>
                            <div className="aside-content">
                                <div className="nav-category  navbar-toggleable-md">
                                    <ul className="nav navbar-pills">


                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link className="nav-link" href="/">Trang chủ</Link></li>



                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link className="nav-link" href="/gioi-thieu">Giới thiệu</Link></li>



                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link href="/collections/all" className="nav-link">Thực đơn</Link>
                                            <i className="fa fa-angle-down"></i>
                                            <ul className="dropdown-menu">


                                                <li className="dropdown-submenu nav-item">

                                                    <Link className="nav-link" href="/">Bánh Piza</Link>
                                                    <i className="fa fa-angle-down"></i>
                                                    <ul className="dropdown-menu">


                                                        <li className="nav-item">

                                                            <Link className="nav-link" href="/">Pizza Hải Sản</Link>
                                                        </li>



                                                        <li className="nav-item">

                                                            <Link className="nav-link" href="/">Pizza Rau Củ</Link>
                                                        </li>


                                                    </ul>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Burger</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Đồ uống</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Trà sữa</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Hoa quả</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Salad</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Xúc xích</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Khoai tây</Link>
                                                </li>



                                                <li className="nav-item">

                                                    <Link className="nav-link" href="/">Piza</Link>
                                                </li>


                                            </ul>
                                        </li>



                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link className="nav-link" href="/tin-tuc">Tin tức</Link></li>



                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link className="nav-link" href="/lien-he">Liên hệ</Link></li>



                                        <li className="nav-item">
                                            <i className="fa  fa-caret-right"></i>
                                            <Link className="nav-link" href="/gioi-thieu">Nhượng quyền</Link></li>


                                    </ul>
                                </div>
                            </div>
                        </aside>





                        <div className="blog-aside aside-item">
                            <div>
                                <div className="aside-title">
                                    <h2 className="title-head"><Link href="/tin-tuc">Tin nổi bật</Link></h2>
                                </div>
                                <div className="aside-content">
                                    <div className="blog-list blog-image-list">

                                        <div className="loop-blog">
                                            <div className="thumb-left">
                                                <Link href="/tu-lam-kho-ga-la-chanh-ngon-tuyet-tai-nha">

                                                    <Image src="//bizweb.dktcdn.net/thumb/small/100/310/257/articles/art1-5e2aebe2-43eb-41a1-98cd-b9cc381ae15d.png?v=1526564713617" style={{ width: "100%" }} alt="Tự làm khô gà lá chanh ngon tuyệt tại nhà" className="img-responsive" />

                                                </Link>

                                            </div>
                                            <div className="name-right">

                                                <h3><Link href="/tu-lam-kho-ga-la-chanh-ngon-tuyet-tai-nha">Tự làm khô gà lá chanh ngon tuyệt tại nhà</Link></h3>
                                                <div className="post-time">
                                                    <i className="fa-solid fa-clock"></i>16/05/2018
                                                </div>

                                            </div>
                                        </div>



                                    </div>

                                </div>
                            </div>
                        </div>


                    </aside>
                </div>
            </div>
            <section className="right-content col-md-9 col-md-push-3">
                <div className="box-heading relative hidden">
                    <h1 className="title-head page_title">Tin tức</h1><span> ( Có tất cả 4 bài viết ) </span>
                </div>


                <section className="list-blogs blog-main">
                    <div className="rows">
                        {blog.map((item)=>
                        <article className="blog-item" key={item.blog_id}>
                            <div className="col-sm-4 col-xs-12">
                                <div className="blog-item-thumbnail">
                                    <Link href={`/blog/${item.blog_id}`}>

                                        <Image src={`/blog/${item.image}`} alt={item.title}/>

                                    </Link>
                                </div>
                            </div>
                            <div className="col-sm-8 col-xs-12">
                                <div className="blog-item-info">
                                    <h3 className="blog-item-name"><Link href={`/blog/${item.blog_id}`}>{item.title}</Link></h3>
                                    <div className="post-time">
                                        <div className="flex" style={{alignItems:"center"}}><i className="fa fa-clock"></i><div>{new Date(item.created_at).toLocaleDateString('vi')}</div></div>
                                        <div className="flex" style={{alignItems:"center"}}><i className="fa fa-eye"></i><div>{item.view}</div></div>

                                    </div>
                                    <p className="blog-item-summary">   {getTruncatedHTML(item.content, 120)}
                                    </p>
                                      {/* <div className="blog-item-summary" dangerouslySetInnerHTML={{ __html: item.content.slice(0,120) }} />...
                                        */}

                                </div> 
                            </div>
                        </article>
)}


                    </div>

                </section>
                <div className="rows">
                    <div className="col-xs-12 text-xs-left">

                    </div>
                </div>

            </section>
            </div>
        </div>
    )
}