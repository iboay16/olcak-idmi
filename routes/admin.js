const express=require("express");
const path=require("path");
const sql = require('mssql');
const config=require("../config")
const İmageupload=require("../helpers/image-upload");
const fs=require("fs");
const router=express.Router();

router.get("/blog/delete/:blogid",async function(req,res){
  const id=req.params.blogid;
  try
   {
    let db = await config;
    let request = db.request();
    const result = await request
                  .input('id', sql.Int, id) 
                  .query('SELECT * FROM blog WHERE blogid = @id');
    const blogs = result.recordset;
    const blog=blogs[0];
    res.render("admin/blog-delete",{
      title:"delete blog",
      blog:blog
    });
   }
   catch(err)
   {
    console.log(err);
   }
});

router.post("/blog/delete/:blogid",async function(req,res){
  const blogid=req.body.blogid;
  try{
    let db = await config;
    let request = db.request();
    const result = await request
     .input('blogid', sql.VarChar, blogid)
     .query("delete from blog where blogid=@blogid ");
     res.redirect("/admin/blogs?action=delete");
  }
  catch(err)
  {
    console.log(err);
  }

})

router.get("/blog/create",async function(req,res){
  try{
    let db = await config;
    let request = db.request();
    const result = await request.query('SELECT * FROM category ');
    const category = result.recordset;
    res.render("admin/blog-create",{
      title:"add blog",
      categories:category
    })
    console.log(category)
  }catch(err)
  {
console.log(err);
  }
   
  });



  router.post("/blog/create",İmageupload.upload.single("resim"), async function (req, res) {
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const resim = req.file.filename;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    try {
      let db = await config;
      let request = db.request();
      console.log(resim);
      const result = await request
        .input('baslik', sql.VarChar, baslik)
        .input('aciklama', sql.VarChar, aciklama)
        .input('resim', sql.VarChar, resim)
        .input('anasayfa', sql.Bit, anasayfa)
        .input('onay', sql.Bit, onay)
        .input('kategori', sql.Int, kategori)
      .query("INSERT INTO blog(baslik,altbaslik, aciklama, resim, anasayfa, onay, categoryid) VALUES (@baslik,@altbaslik, @aciklama, @resim, @anasayfa, @onay, @kategori)");

      res.redirect("/admin/blogs?action=create");
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message); // Hata durumunu istemciye bildir
    }
  
    console.log(req.body); // Form verileri
  });
  

  router.get("/blogs/:blogid",async function(req,res){
    const id=req.params.blogid;

    try{
      let db = await config;
      let request = db.request();
      const result = await request
      .input('id', sql.Int, id) 
      .query('SELECT * FROM blog WHERE blogid = @id');
            
      const blogs = result.recordset;
      const category = await request.query('SELECT * FROM category ');
      const categoryList = category.recordset;
      const blog=blogs[0];

      if(blog){
       return res.render("admin/blog-edit",{
          title:blog.baslik,
          blog:blog,
          categories:categoryList
        })
      }
      res.redirect("admin/blogs");
    }
    catch(err)
    {
    console.log(err)
    }
    
  });

  router.post("/blogs/:blogid",İmageupload.upload.single("resim"),async function(req,res)
  {
      const blogid=req.body.blogid;
      const baslik=req.body.baslik;
      const altbaslik=req.body.altbaslik;
      const aciklama=req.body.aciklama;
      let resim=req.body.resim;
      if(req.file){
        resim=req.file.filename;
        fs.unlink("./public/images/"+req.body.resim,err=>{
          console.log(err);
        });
      }
      const anasayfa=req.body.anasayfa=="on" ? 1:0;
      const onay=req.body.onay=="on" ? 1:0;
      const kategori=req.body.kategori;
      try{
        let db = await config;
        let request = db.request();
        const result = await request
        .input('blogid',sql.Int,blogid)
        .input('baslik', sql.VarChar, baslik)
        .input('altbaslik', sql.VarChar, altbaslik)
        .input('aciklama', sql.VarChar, aciklama)
        .input('resim', sql.VarChar, resim)
        .input('anasayfa', sql.Bit, anasayfa)
        .input('onay', sql.Bit, onay)
        .input('kategori', sql.Int, kategori)
        .query("UPDATE blog SET baslik=@baslik,altbaslik=@altbaslik,aciklama=@aciklama,resim=@resim,anasayfa=@anasayfa,onay=@onay,categoryid=@kategori WHERE blogid=@blogid ");
        res.redirect("/admin/blogs?action=edit&blogid="+blogid)
        
      }
      catch(err)
      {
        console.log(err);
      }

  })
  router.get("/blogs",async function(req,res){
    try{
      let db = await config;
      let request = db.request();
      const result = await request.query('SELECT blogid,baslik,altbaslik,resim FROM blog');
      const blog = result.recordset;
      res.render("admin/blog-list",{
        title:"blog list",
        blogs:blog,
        action:req.query.action,
        blogid:req.query.blogid
      });
    }
    catch(err)
    {
      console.log(err);
    }
  
  });




  router.get("/categories",async function(req,res){
    try{
      let db = await config;
      let request = db.request();
      const result = await request.query('SELECT * FROM category');
      const categories = result.recordset;
      res.render("admin/category-list",{
        title:"category list",
        categories:categories,
      });

    }
    catch(err)
    {
      console.log(err);
    }
  });


  router.get("/category/create",async function(req,res){
    try{
      res.render("admin/category-create",{
        title:"add category",
      })
    
    }catch(err)
    {
  console.log(err);
    }
     
    });
 

    
  router.post("/category/create", async function (req, res) {
    const name = req.body.ad;
    
    try {
      let db = await config;
      let request = db.request();
      const result = await request
        .input('name', sql.NVarChar, name)
        .query("INSERT INTO category(name) VALUES (@name)");
  
      res.redirect("/admin/categories");
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message); // Hata durumunu istemciye bildir
    }
  
    console.log(req.body); // Form verileri
  });



  router.get("/category/delete/:categoryid",async function(req,res){
    const id=req.params.categoryid;
    try
     {
      let db = await config;
      let request = db.request();
      const result = await request
                    .input('id', sql.Int, id) 
                    .query('SELECT * FROM category WHERE categoryid = @id');
      const blogs = result.recordset;
      const blog=blogs[0];
      res.render("admin/category-delete",{
        title:"delete blog",
        blog:blog
      });
     }
     catch(err)
     {
      console.log(err);
     }
  });
  
  router.post("/category/delete/:categoryid",async function(req,res){
    const categoryid=req.body.categoryid;
    try{
      let db = await config;
      let request = db.request();
      const result = await request
       .input('categoryid', sql.VarChar, categoryid)
       .query("delete from category where categoryid=@categoryid");
       res.redirect("/admin/categories");
    }
    catch(err)
    {
      console.log(err);
    }
  
  })



  
  router.get("/categorys/:categoryid",async function(req,res){
    const id=req.params.categoryid;

    try{
      let db = await config;
      let request = db.request();
      const result = await request
      .input('categoryid', sql.Int, id) 
      .query('SELECT * FROM category WHERE categoryid = @categoryid');
            
      const blogs = result.recordset;
      const blog=blogs[0];

      if(blog){
       return res.render("admin/category-edit",{
          title:blog.baslik,
          blog:blog,
        })
      }
      res.redirect("admin/categories");
    }
    catch(err)
    {
    console.log(err)
    }
    
  });

  router.post("/categorys/:categoryid",async function(req,res)
  {
      const blogid=req.body.blogid;
      const ad=req.body.baslik;
      console.log(req.body.categoryid);
      console.log(req.body.baslik);
      try{
        let db = await config;
        let request = db.request();
        const result = await request
        .input('categoryid',sql.Int,blogid)
        .input('name', sql.VarChar, ad)
        .query("UPDATE category SET name=@name WHERE categoryid=@categoryid ");

        res.redirect("/admin/categories")
        
      }
      catch(err)
      {
        console.log(err);
      }

  });
  

module.exports=router;