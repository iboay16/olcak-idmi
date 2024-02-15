            const express=require("express");
            const path=require("path");
            const router=express.Router();
            const sql = require('mssql');
            const config=require("../config")

            const data={
               title:"Popiler Kurslar",
               categories:["Wep Geliştirme","Programlama","Weri Analizi","Mobil Uygulama","Ekstra Bilgi"],
               blogs:[
                  {
                     blogid:1,
                     baslik:"Kopmle Uygulamalı Wep Geliştirme",
                     aciklama:"MÜKEMMEL KURS BAŞARILI COK BEGENDİM",
                     resim:"hayvan.jpg",
                     anasayfa:true,
                     onay:true
                  },
                  {
                     blogid:2,
                     baslik:"C# PROGRAMLAMA",
                     aciklama:"MÜKEMMEL KURS BAŞARILI COK BEGENDİM",
                     resim:"arkadas.jpg",
                     anasayfa:true,
                     onay:true
                  },
                  {

                     blogid:3,
                     baslik:"PYTHON PROGRAMLAMA",
                     aciklama:"MÜKEMMEL KURS BAŞARILI COK BEGENDİM",
                     resim:"araba.jpeg",
                     anasayfa:true,
                     onay:true
                  },
                  {
                     blogid:4,
                     baslik:"PYTHON PROGRAMLAMA",
                     aciklama:"MÜKEMMEL KURS BAŞARILI COK BEGENDİM",
                     resim:"araba.jpeg",
                     anasayfa:true,
                     onay:true
                  }
                  
                  

               ],
               
            }
            router.use("/blogs/category/:categoryid", async function (req, res) {
               const id = req.params.categoryid;
               console.log(id);
               try {
                   let db = await config;
                   let request = db.request();
                   const result = await request
                       .input('id', sql.Int, id)
                       .query('SELECT * FROM blog WHERE categoryid = @id');
                   const blogs = result.recordset;
           
                   const result2 = await request
                       .query('select * from category');
                   const category = result2.recordset;
           
                   res.render("users/blogs", {
                       title: "Tüm Kurslar",
                       blogs: blogs,
                       categories: category,
                       selectedCategory:id
                   });
               } catch (err) {
                   console.log(err);
               }
           });
           
           
            router.use("/blogs/:blogid", async function (req, res) {
               const id = req.params.blogid;
               try {
               let db = await config;
               let request = db.request();
               const result = await request
                  .input('id', sql.Int, id) 
                  .query('SELECT * FROM blog WHERE blogid = @id');
            
               const blogs = result.recordset;
               //KONTROL KISMI EGER BLOG YOK İSE ANA SAYFAYA GİDERu
               if(blogs)
               {
                  res.render("users/blog-details", {
                     title:blogs.aciklama,
                     blog: blogs[0]
                  });
               }
               res.redirect("/");
               
               } catch (err) {
               console.log(err);
               }
            });
            router.use("/ceyda", async function(req, res) {
               res.render("users/ceyda", {
                   // Burada gerekirse veri gönderebilirsiniz
               });
           });

           router.use("/memet", async function(req, res) {
            res.render("users/memet", {
               
            });
        });
           
            
            //VERİLERİ SAYFAYA SQL DEN CEKİP YOLLUYORUZ
            router.use("/blogs",async function(req,res){
               try{
                  let db = await config;
                  let request = db.request();
                  const result = await request.query('SELECT * FROM blog where onay=1');
                  const result2=await request.query('select * from category');
                  const category=result2.recordset;
                  const users = result.recordset;
                  console.log(users[1]);
                  res.render("users/blogs",{
                     title:"Tüm Kurslar",
                     blogs:users,
                     categories:category,
                     selectedCategory:null
                  });
               }
               catch{

               }
               
            
            });
            router.use("/",async function(req,res){
            
               try{
                  let db = await config;
                  let request = db.request();
                  const result = await request.query('SELECT * FROM blog where onay=1 and anasayfa=1 ');
                  const result2=await request.query('select * from category');
                  const category=result2.recordset;
                  const users = result.recordset;
                  console.log(category[1]);
                  //console.log(users[1]);
                  res.render("users/index",{
                     title:"Popiler Kurslar",
                     blogs:users,
                     categories:category,
                     selectedCategory:null
                  });
               }
               catch(err){
                  console.log(err);
               }
               
            
            
            });

            module.exports=router;