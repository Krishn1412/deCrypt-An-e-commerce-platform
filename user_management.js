const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const hbs = require("hbs");
const mysql = require("mysql")
const path = require("path");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { time } = require("console");
const { NULL } = require("mysql/lib/protocol/constants/types");
const { rmSync } = require("fs");
const app = express();
const _ = require('underscore');
const Vector = require('vector-object');
const sw = require('stopwords');
const natural =require('natural');
const fs = require('fs');
const fileName = 'e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/src/data.json';
const file = require(fileName);
const { object, result } = require('underscore');

var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];

const {TfIdf,PorterStemmer,Ngram} = natural;

class recommender {

    train(documents){

        // step 1: Data preprocesing
        const preprodoc = this.__preprocess(documents);

        //step 2 : Create vecrtors from documents.
        const dVectors = this.__vectorization(preprodoc);

        //step 3: Find cosine similarities.
        const data = this.__cosineSimilarity(dVectors);
        return data;

    }



    __preprocess(documents){
        const formatted = documents.map(l =>{
            let tokens = this.__preprocess2(l[1]);
            return {
                id:l[0],
                tokens
            };
        });
       
        return formatted;
    }


    __preprocess2(content){
        content = content.toLowerCase();
        const final = this.__remove_stopwords(content);
        //console.log(final);
        return final;
    }


    __remove_stopwords(str) {
        var res = []
        var words = str.split(' ')
        for(let i=0;i<words.length;i++) {
           var word_clean = words[i].split(".").join("")
           if(!stopwords.includes(word_clean)) {
               res.push(word_clean)
           }
        }
        return(res.join(' '))
    }

    __vectorization(documents){
        const tfidf = new TfIdf();

        documents.forEach(doc =>{
            tfidf.addDocument(doc.tokens);
        });
        
        const docVector = [];
        for(let i=0;i<documents.length;i++){
            const currDoc = documents[i];
            const obj = {};

            const items = tfidf.listTerms(i);
            for(let j=0;j<items.length;j++){
                obj[items[j].term] = items[j].tfidf;
            }
            
            const currDocVector = {
                id: currDoc.id,
                vector: new Vector(obj)
            };

            docVector.push(currDocVector);
        }
        //console.log(docVector);
        return docVector;
    }


    __cosineSimilarity(documents){
        const MAX_SIMILAR = 20;
        const MIN_SCORE = 0.1;
        const data = {};

        for (let i = 0; i < documents.length; i += 1) {
            const { id } = documents[i];
            data[id] = [];
        }

        for(let i=0;i<documents.length;i++){
            
            for(let j=0;j<i;j++){
                const idA = documents[i].id;
                const vA = documents[i].vector;
                const idB = documents[j].id;
                const vB = documents[j].vector;

                const similarity = vA.getCosineSimilarity(vB);
                
                if(similarity>MIN_SCORE){
                    data[idA].push({
                        id:idB,
                        score:similarity,
                    });
                    data[idB].push({
                        id:idA,
                        score:similarity,
                    });
                }
            }
        }
        Object.keys(data).forEach(id => {
            data[id].sort((a, b) => b.score - a.score);
        
            if (data[id].length > MAX_SIMILAR) {
              data[id] = data[id].slice(0, MAX_SIMILAR);
            }
        });
        return data;
    }
    getSimilarDocuments(id, data){
        let similarDocuments = data[id];
      
        if (similarDocuments === undefined) {
          return [];
        }
      
        return similarDocuments;
      };
}


app.set('view engine','hbs');

app.use(bodyParser.urlencoded({
    extended:true
}));

// app.get("/",(req,res)=>{
//     res.send("login_signup.html");
// });


// GLOBAL ARRAY CONTAINING DESCP OF ALL PRODUCTS
var descpA =[];
var nameA = [];

const db = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    database:'og-database'

});

app.set('views', path.join(__dirname, 'views'));

const publicDirectory = path.join(__dirname,"./public");
app.use(express.static(publicDirectory));

app.set('view engine','hbs');

db.connect((error)=>{
  if(error){
      console.log("Error in running MySQL")
  }
  else{
      console.log("MySQL running")
  }

})
app.listen(5000,function(){
    console.log("Server started on port 5000")
});
app.get("/",(req,res)=>{
	res.render("landingPage.hbs");
})

var global_username,global_username_S,global_username_A;

//LOGIN ACTION
app.post("/login",(req,res)=>{
    console.log(req.body);
    const {username ,passcode} = req.body;
    console.log(passcode);

	db.query("SELECT * FROM user WHERE email = ? and password =?",[username,passcode],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
			global_username=username;
			res.redirect("/welcome");
        }
        else{
            return res.render("index", {message:'Invalid username or password'});
        }

        res.end();
    });

});

// Logout action for user
app.get("/logout",(req,res)=>{
	global_username="";
    res.redirect("/");
});

app.get("/logout_seller",(req,res)=>{
	global_username_S="";
    res.redirect("/");
});

app.get("/logout_admin",(req,res)=>{
	global_username_A="";
    res.redirect("/");
});

app.get("/welcome",(req,res)=>{
	db.query("SELECT Name,ID,Password FROM user WHERE Email = ?",[global_username],(error,results)=>{
		if(error){
			console.log(error);
		}
		if(results.length >0){
			// console.log(results[0]);
			res.redirect("/dash_render");
		}
	});
});
 
app.get("/welcome1",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/sellerDash.html");
});

app.get("/welcome2",(req,res)=>{
    res.render("adminDash.hbs");
});

// LOGIN ACTION FOR SELLER

app.post("/loginS",(req,res)=>{
    console.log(req.body);
    const {username ,passcode} = req.body;
    console.log(passcode);

	db.query("SELECT * FROM seller WHERE email = ? and password =?",[username,passcode],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
			global_username_S=username;
            //console.log(global_username_S);
			res.redirect("/welcome1");
        }
        else{
            return res.render("index11", {message:'Invalid username or password'});
        }

        res.end();
    });

});

// LOGIN FOR ADMIN

app.post("/loginA",(req,res)=>{
    console.log(req.body);
    const {username ,passcode} = req.body;
    console.log(passcode);

	db.query("SELECT * FROM admin WHERE email = ? and password =?",[username,passcode],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
			global_username_A=username;
			res.redirect("/welcome2");
        }
        else{
            return res.render("index12", {message:'Invalid username or password'});
        }

        res.end();
    });

});


// SIGNUP ACTION

app.post("/signup",(req,res)=>{
    console.log(req.body);
    const {name,email,password} = req.body;
    console.log(email);

	db.query('SELECT Email FROM user WHERE Email = ?',[email],(error, results)=>{

        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("index.hbs",{
                message:"That email is already in use"
            });
        } 
		else{
			db.query("INSERT INTO user SET ?", {name: name, email:email,password:password},(error,results) =>{
				if(error){
					console.log(error);
				}else{
                    global_username=email;
					res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/signup.html");
				}
			});
		}
    });
});

app.post("/signupS",(req,res)=>{
    console.log(req.body);
    const {name,email,password,mobile,eth} = req.body;
    console.log(email);

	db.query('SELECT Email FROM seller WHERE Email = ?',[email],(error, results)=>{

        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("index11.hbs",{
                message:"That email is already in use"
            });
        } 
		else{
			db.query("INSERT INTO seller SET ?", {name: name, email:email,password:password,Mobile:mobile,Eth_Address:eth},(error,results) =>{
				if(error){
					console.log(error);
				}else{
					res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/sellerDash.html");
				}
			});
		}
    });
});

app.get("/gotos",(req,res)=>{
    res.render("index11.hbs");
});
app.get("/gotoa",(req,res)=>{
    res.render("index12.hbs");
});

// PERSONAL INFORMATION UPDATE

app.post("/personal",(req,res)=>{
    console.log(req.body);
    const {gender,age,mobile} = req.body;
    console.log(gender);
    db.query("UPDATE user SET ? WHERE email=?",[{Gender: gender,Age: age, MobileNumber:mobile},[global_username]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/signup2.html");
        }
    });
});
app.post("/update_prof",(req,res)=>{
    res.render("update.hbs");
});
app.post("/personal11",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/update2.html");
});
app.post("/personal12",(req,res)=>{
    res.redirect("/userDash");
});

// ADDRESS AND PAYMENT UPDATE

app.post("/personal2",(req,res)=>{
    console.log(req.body);
    const {add1,add2,city,state,postalcode,option,accnt,eth} = req.body;
    let idi,mobi;
    console.log(global_username);
    db.query("SELECT ID,MobileNumber FROM user WHERE Email = ?",[global_username],(error,results)=>{
		if(error){
			console.log(error);
		}
		if(results.length >0){
			idi = results[0].ID;
            mobi = results[0].MobileNumber;
            db.query("INSERT INTO user_address SET ?", {User_ID:idi,Address_Line1:add1,Address_Line2:add2,City:city,State:state,Postal_Code:postalcode,Mobile:mobi},(error,results) =>{
                if(error){
                    console.log(error);
                }else{
                    db.query("INSERT INTO user_payment SET ?", {User_ID:idi,Payment_Type:option,Account_Number:accnt,Eth_Address:eth},(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            res.redirect("/userDash");
                        }
                    });
                }
            });
		}
	});
});


// USER DASHBOARD ACCESS

app.get("/userDash",(req,res)=>{ 
    db.query("SELECT ID,Name,Email FROM user WHERE Email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("userDash.hbs",{
                message1:results[0].ID,
                message2:results[0].Name,
                message3:results[0].Email,
            });   
        }
    });
});



// SELLER REQUEST

// let curr_prod_id=-1;

app.post("/sellerReq",(req,res)=>{
    const {name,category,quantity,price,discount,description,seller,img} = req.body;
    db.query("INSERT INTO product_req SET ?",{Name:name,CategoryID:category,Inventory:quantity,Price:price,DiscountID:discount,Descp:description,SellerID:seller,Img:img},(error,results) =>{

        if(error){
			console.log(error);
		}
		else{
            res.redirect("/apd24");
		}
	});
});

app.post("/sellerReq2",(req,res)=>{
    const {prodID,img1,img2,img3,img4} = req.body;
    db.query("INSERT INTO product_img SET ?",{prodID:prodID,img1:img1,img2:img2,img3:img3,img4:img4},(error,results) =>{

        if(error){
			console.log(error);
		}
		else{
            res.redirect("/apd24");
            
		}
	});
});


// BUILDING THE SEARCH ENGINE

app.post("/search1",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/search1.html");
});

app.post("/search2",(req,res)=>{
    const {text} = req.body;
    console.log(req.body)
    db.query("SELECT ID,Name,Descp FROM product ",(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let newId = results[results.length-1].ID;
            newId++;
            descpA = [];
            nameA =[];
            for(let i=0;i<results.length;i++){
                nameA.push([results[i].ID,results[i].Name]);
            }
            for(let i=0;i<results.length;i++){
                descpA.push([results[i].ID,results[i].Descp]);
            }
            descpA.push([newId,text]);
            nameA.push([newId,text]);
            // console.log(descpA);
            // console.log(nameA);
            let idii1 = newId.toString();
            const algo = new recommender();
            const data = algo.train(descpA);
            const ans1 = algo.getSimilarDocuments(idii1,data);
            const data1 =algo.train(nameA);
            const ans2 =algo.getSimilarDocuments(idii1,data1);
            // console.log("he eh");
            // console.log(ans1);
            // console.log(ans2);
            const ans = ans1.concat(ans2);
            // console.log(ans);
            var arr =[];
            for(let i=0;i<ans.length;i++){
                arr.push(ans[i].id);
            }
            console.log(arr);
            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    // console.log(results);
                    console.log(results[0].Img);
                    return res.render("products.hbs",{
                        results:results
                    }); 
                }
            });
            // res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/og-website/views/search1.html");   
        }
    });
    // res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/og-website/views/search1.html");
});

// SELLER ADD PRODUCTS

// ALL THE GET REQS WILL BE HERE
app.get("/sellAdProd",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/sellerReq.html");
});
app.get("/sellAdImg",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/sellerReq2.html");
});
app.get("/apd23",(req,res)=>{
    res.render("adminDash.hbs");
});
app.get("/loginPage",(req,res)=>{
    res.render("index.hbs");
});

app.get("/apd24",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/sellerDash.html");
});

app.get("/apd25",(req,res)=>{
    res.render("userDash.hbs");
});

app.post("/addDisco",(req,res)=>{
    res.sendFile("e:/Krishn/bits/SEM 5/blockchain1/deCrypt-An-e-commerce-platform/views/addDisco.html");
});
/// TILL HERE

// DISPLAYING PRODUCT REQUESTS TO ADMIN

app.get("/adminSeeProd",(req,res)=>{ 
    db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,SellerID FROM product_req ",(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("viewProdReq.hbs",{
                results:results
            });   
        }
    });
});

app.post("/addProd",(req,res)=>{ 
    console.log(req.body.add);
    const idii=req.body.add;

    db.query("SELECT Name,CategoryID,Inventory,Price,Descp,SellerID,Img FROM product_req WHERE ID = ?",[idii],(error,results)=>{
		if(error){
			console.log(error);
		}
		if(results.length >0){
            var name = results[0].Name;
            var sid = results[0].SellerID;
            var descp1 = results[0].Descp;
            db.query("INSERT INTO product SET ?", {Name:results[0].Name,CategoryID:results[0].CategoryID,Inventory:results[0].Inventory,Price:results[0].Price,Descp:results[0].Descp,SellerID:results[0].SellerID,Img:results[0].Img},(error,result,field) =>{
                if(error){
                    console.log(error);
                }else{
                    const idP = result.insertId;
                    db.query("DELETE FROM product_req WHERE ID = ?", [idii],(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            // descpA.push([idP,descp1]);
                            // console.log(descpA);
                            res.redirect("/adminSeeProd");
                        }
                    });
                }
            });
		}
	});
});

//SELLER VIEW PRODUCT

app.post("/sellViewProd",(req,res)=>{ 
    console.log(global_username_S);
    db.query("SELECT id FROM seller WHERE email = ?",[global_username_S],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT Name,CategoryID,Inventory,Price,Descp FROM product WHERE SellerID = ?",[id11],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    return res.render("viewProdSeller.hbs",{
                        results:results
                    });
                }
            });
        }
    });

});

// ADDING DISCOUNT FEATURE

app.post("/addDisco1",(req,res)=>{ 
    const {id,disco} = req.body;
    
    db.query("UPDATE product SET ? WHERE ID=?",[{DiscountID: disco},[id]],(error,results) =>{
        if(error){
            console.log(error);
        }
        else{
            console.log(id);
            db.query("INSERT INTO discount SET ?",{ProdID:id,Disco:disco},(error,results) =>{

                if(error){
                    console.log(error);
                }
                else{
                    res.render("adminDash.hbs");
                }
            });
        }
    });
});

app.get("/viewDisco",(req,res)=>{ 
    db.query("SELECT ID,ProdID,Disco FROM discount ",(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results[0].ProdID);
            return res.render("viewDisco.hbs",{
                results:results
            });   
        }
    });
});

app.post("/removeDisco",(req,res)=>{ 
    const idii=req.body.add;

    db.query("UPDATE product SET ? WHERE ID=?",[{DiscountID: 0},[idii]],(error,results) =>{
		if(error){
			console.log(error);
		}
		else {

            db.query("DELETE FROM discount WHERE ProdID = ?", [idii],(error,results) =>{
                if(error){
                    console.log(error);
                }else{
                    res.redirect("/viewDisco");
                }
            });
		}
	});
});
 
// VIEW PRODUCT FOR SELLER

app.get("/sellViewProd",(req,res)=>{ 
    db.query("SELECT id FROM seller WHERE email = ?",[global_username_S],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].ID;
            // console.log(id11);
            db.query("SELECT Name,CategoryID,Inventory,Price,Descp FROM product WHERE SellerID = ?",[id11],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    return res.render("viewSellerProd.hbs",{
                        results:results
                    });
                }
            });
        }
        if(results.length==0){
            res.send("<h1>No product issued by the seller</h1>")
        }
    });
});


// EXPANDING THE CARD AND TAKING IT TO THE MAIN TEMPLATE


app.post("/take_prod_page",(req,res)=>{
    console.log("he he ")
    const {id} = req.body;
    console.log(id);
    db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp FROM product WHERE ID = ?",[id],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            db.query("SELECT img1,img2,img3,img4 FROM product_img WHERE prodID = ?",[id],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                
                if(results1.length >0){
                    var s="Random";
                    if(results[0].CategoryID===1)s="Electronics";
                    if(results[0].CategoryID===2)s="Fashion";
                    if(results[0].CategoryID===3)s="Home Accessory";
                    if(results[0].CategoryID===4)s="Art and Craft";
                    console.log(results[0].CategoryID);
                    console.log(results1[0].img1);
                    return res.render("product_template.hbs",{
                        results:results[0],results1:results1[0],s:s
                    });
                }
            })
        }
    });
});

app.post("/viewCmnt",(req,res)=>{
    console.log("he he ")
    const {id} = req.body;
    console.log(id);    
    db.query("SELECT ID,userEmail,Text,Likes FROM comment WHERE prodID = ?",[id],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
            return res.render("Comments.hbs",{
                message1:results.length,
                message2:global_username,
                message3:id,
                results:results,
            });
        }
    });
});

app.post("/newCmnt",(req,res)=>{
    const {email,prodID,message}=req.body;
    db.query("INSERT INTO comment SET ?", {userEmail:email,prodID:prodID,Text:message},(error,results) =>{
        if(error){
            console.log(error);
        }else{
            db.query("SELECT ID,userEmail,Text,Likes FROM comment WHERE prodID = ?",[prodID],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    console.log(results);
                    return res.render("Comments.hbs",{
                        message1:results.length,
                        message2:global_username,
                        message3:prodID,
                        results:results,
                    });
                }
            });
        }
    }); 
});

app.post("/gotoCart",(req,res)=>{
    db.query("SELECT ID FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            const uid = results[0].ID;
            console.log(uid);
            db.query("SELECT ID,prodID,Quantity FROM cart WHERE userID = ?",[uid],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    console.log(results1);
                    var arr1 =[];
                    for(let i=0;i<results1.length;i++){
                        arr1.push(results1[i].prodID);
                    }
                    //db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                    db.query("SELECT ID,Name,CategoryID,Price FROM product WHERE ID IN (?)",[arr1],(error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results2.length >0){
                            var arr2 =[];
                            let price=0;
                            var carr =[];
                            arr2=results2;
                            arr2.forEach(obj => obj.quantity = 0);
                            for(let i=0;i<results1.length;i++){
                                for(let j=0;j<results2.length;j++){
                                    if(results1[i].prodID===results2[j].ID){
                                        arr2[j].quantity=results1[i].Quantity;
                                        // arr2[j].cartID=results1[i].ID;
                                        carr.push(results1[i].ID)
                                    }
                                }
                            }
                            for(let j=0;j<results2.length;j++){
                                price+=parseInt(results2[j].Price);
                            }
                            console.log(arr2);
                            return res.render("cart.hbs",{
                                results2:arr2,carr:carr,price:price
                            });
                        }
                    });
                }
                else if(results1.length===0){
                    console.log("hui hehe")
                    return res.render("cart.hbs",{
                        message:'The cart is empty'
                    });
                }
            });
        }
    });
});


// ADDING OT CART

app.post("/addCart",(req,res)=>{
    const {prodID,quantity} = req.body;
    db.query("SELECT ID FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            const uid = results[0].ID;
            console.log(uid);
            db.query("SELECT * FROM cart WHERE prodID = ? AND userID = ?",[prodID,uid],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    const qq = results[0].Quantity;
                    let qq1 = parseInt(qq);
                    let lm1 = parseInt(quantity);
                    let pq = lm1+qq1;
                    const lm = pq.toString();
                    db.query("UPDATE cart SET ? WHERE prodID=? AND userID =?",[{Quantity:lm},[prodID],[uid]],(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp FROM product WHERE ID = ?",[prodID],(error,results)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results.length >0){
                                    db.query("SELECT img1,img2,img3,img4 FROM product_img WHERE prodID = ?",[prodID],(error,results1)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        
                                        if(results1.length >0){
                                            return res.render("product_template.hbs",{
                                                results:results[0],results1:results1[0]
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
        
                }
                else if(results.length===0){
                    db.query("INSERT INTO cart SET ?", {prodID: prodID , userID:uid,Quantity:quantity},(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp FROM product WHERE ID = ?",[prodID],(error,results)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results.length >0){
                                    db.query("SELECT img1,img2,img3,img4 FROM product_img WHERE prodID = ?",[prodID],(error,results1)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        
                                        if(results1.length >0){
                                            return res.render("product_template.hbs",{
                                                results:results[0],results1:results1[0]
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });

        }
    });
});

app.post("/proPay1",(req,res)=>{
    const carr = req.body.cartID;
    const price =req.body.price;
    console.log(price);
    var carr1 = [];
    for(let i=0;i<carr.length;i++){
        if(carr[i]===',')continue;
        else carr1.push(carr[i]);
    }
    db.query("SELECT ID FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            const uid = results[0].ID;
            console.log(uid);
            db.query("SELECT Address_Line1,Address_Line2,City,State,Postal_Code FROM user_address WHERE User_ID = ?",[uid],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    console.log(results1);
                    return res.render("proPay.hbs",{
                        results1:results1,carr:carr1,price:price
                    });
                }
            });
        }
    });
});

// app.post("/proPay2",(req,res)=>{
//     const carr = req.body.cartID;
//     var carr1 = [];
//     for(let i=0;i<carr.length;i++){
//         if(carr[i]===',')continue;
//         else carr1.push(carr[i]);
//     }
//     console.log(carr1);
//     db.query("SELECT ID FROM user WHERE email = ?",[global_username],(error,results)=>{
//         if(error){
//             console.log(error);
//         }
//         if(results.length >0){
//             const uid = results[0].ID;
//             console.log(uid);
//             db.query("SELECT Address_Line1,Address_Line2,City,State,Postal_Code FROM user_address WHERE User_ID = ?",[uid],(error,results1)=>{
//                 if(error){
//                     console.log(error);
//                 }
//                 if(results1.length >0){
//                     console.log(results1);
//                     return res.render("proPay.hbs",{
//                         results1:results1,carr:carr1,
//                     });
//                 }
//             });
//         }
//     });
// });


app.post('/proPay2', (req, res) => {
    const carr = req.body.cartID;
    const price12 =req.body.price;
    // console.log(carr.length);
    let price1 = parseInt(price12);
    price1=price1/100;
    const price = price1.toString();
    var carr1 = [];
    for(let i=0;i<carr.length;i++){
        if(carr[i]===',')continue;
        else carr1.push(carr[i]);
    }
    db.query("SELECT Address FROM admin WHERE ID = ?",[1],(error,results1)=>{
        if(error){
            console.log(error);
        }
        if(results1.length >0){
            console.log(results1[0]);
            const add = results1[0].Address;
            file.sellerAdd = add;
            file.price = price;
            file.email = global_username;
            file.ind = 1;
            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file));
            console.log('writing to ' + fileName);
            });
            var url = "http://localhost:3000";
            res.redirect(url);
        }
    });

 });

 app.get('/paySuc', (req, res) => {
    console.log(file.email);
    if(file.ind===1)global_username=file.email;
    else global_username_A=file.email;
    res.render("success.hbs");
 });

 app.post('/orderDeets',(req,res)=>{
    db.query("SELECT ID FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            const uid = results[0].ID;
            console.log(uid);
            db.query("SELECT ID,prodID,Quantity FROM cart WHERE userID = ?",[uid],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    console.log(results1);
                    var arr1 =[];
                    for(let i=0;i<results1.length;i++){
                        arr1.push(results1[i].prodID);
                    }
                    //db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                    db.query("SELECT ID,Name,CategoryID,Price,SellerID FROM product WHERE ID IN (?)",[arr1],(error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results2.length >0){
                            var arr2 =[];
                            let price=0;
                            var carr =[];
                            arr2=results2;
                            arr2.forEach(obj => obj.quantity = 0);
                            for(let i=0;i<results1.length;i++){
                                for(let j=0;j<results2.length;j++){
                                    if(results1[i].prodID===results2[j].ID){
                                        arr2[j].quantity=results1[i].Quantity;
                                        // arr2[j].cartID=results1[i].ID;
                                        carr.push(results1[i].ID)
                                    }
                                }
                            }
                            var items = [];
                            for(let j=0;j<results2.length;j++){
                                price+=parseInt(results2[j].Price);
                            }
                            for(let i=0;i<arr2.length;i++){
                                items.push([uid,arr2[i].ID,arr2[i].Price,arr2[i].quantity,arr2[i].SellerID]);
                            }
                            db.query("INSERT INTO orderp (userID, prodID, price, quantity,sellerID) VALUES ?",[items],(error,results) =>{
                                if(error){
                                    console.log(error);
                                }else{
                                    db.query("DELETE FROM cart WHERE userID = ?", [uid],(error,results) =>{
                                        if(error){
                                            console.log(error);
                                        }else{
                                            return res.render("orderDeets.hbs",{
                                                results2:arr2
                                            });
                                        }
                                    });
                                }
                            });
                            
                        }
                    });
                }
            });
        }
    });
 });

 app.post("/backUser",(req,res)=>{
    res.redirect("/userDash");
 });

 app.get("/sellViewOrd",(req,res)=>{
    db.query("SELECT id FROM seller WHERE email = ?",[global_username_S],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT ID,userID,prodID,quantity FROM orderp WHERE sellerID = ? AND status = '0'",[id11],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    return res.render("sellerOrders.hbs",{
                        results:results
                    });
                }
                else{
                    res.render("sellerOrders.hbs",{
                        message:"No orders yet"
                    });
                }
            });
        }
    }); 
 });

 // DELIVER PRODUCT

 app.post("/postProd",(req,res)=>{ 
    console.log(req.body.add);
    const idii=req.body.add;

    db.query("SELECT ID,userID,prodID,sellerID FROM orderp WHERE ID = ?",[idii],(error,results)=>{
		if(error){
			console.log(error);
		}
		if(results.length >0){
            var oid = results[0].ID;
            var uid = results[0].userID;
            var sid = results[0].sellerID;
            var pid = results[0].prodID;
            db.query("INSERT INTO enroute SET ?", {userID:uid,orderID:oid,prodID:pid,sellerID:sid},(error,result,field) =>{
                if(error){
                    console.log(error);
                }else{
                    const idP = result.insertId;
                    db.query("UPDATE orderp SET status='1' WHERE ID = ?",[[oid]],(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            // descpA.push([idP,descp1]);
                            // console.log(descpA);
                            res.redirect("/sellViewOrd");
                        }
                    });
                }
            });
		}
	});
});

app.get("/sellViewRoute",(req,res)=>{
    db.query("SELECT id FROM seller WHERE email = ?",[global_username_S],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT ID,userID,prodID,orderID FROM enroute WHERE sellerID = ?",[id11],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    return res.render("sellerRoute.hbs",{
                        results:results
                    });
                }
                else{
                    res.render("sellerRoute.hbs",{
                        message:"No order posted yet"
                    });
                }
            });
        }
    }); 
 });

 app.get("/trackProd",(req,res)=>{
    db.query("SELECT id FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT ID,sellerID,prodID,orderID FROM enroute WHERE userID = ?",[id11],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                    return res.render("userRoute.hbs",{
                        results:results
                    });
                }
                else{
                    res.render("userRoute.hbs",{
                        message:"No order posted yet"
                    });
                }
            });
        }
    }); 
 });

 app.post("/recvProd",(req,res)=>{ 
    console.log(req.body.add);
    const idii=req.body.add;
    console.log("hui hui hui");
    db.query("SELECT ID,orderID,prodID,sellerID FROM enroute WHERE ID = ?",[idii],(error,results)=>{
		if(error){
			console.log(error);
		}
		if(results.length >0){
            var idi = results[0].ID
            var oid = results[0].orderID;
            var uid = results[0].userID;
            var sid = results[0].sellerID;
            var pid = results[0].prodID;
            db.query("DELETE FROM enroute WHERE ID = ?",[idi],(error,result,field) =>{
                if(error){
                    console.log(error);
                }else{
                    const idP = result.insertId;
                    db.query("UPDATE orderp SET status='2' WHERE ID = ?",[[oid]],(error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            res.redirect("/trackProd");
                        }
                    });
                }
            });
		}
	});
});

app.post("/adminViewDel",(req,res)=>{ 
    console.log(req.body.add);
    const idii=req.body.add;
    db.query("SELECT ID,price,quantity,sellerID FROM orderp WHERE status='2'",(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("adminViewDel.hbs",{
                results:results
            });
        }
        else{
            res.render("userRoute.hbs",{
                message:"No order posted yet"
            });
        }
	});
});


app.post("/adminPay2",(req,res)=>{ 
    console.log(req.body.add);
    const idii=req.body.add;
    db.query("SELECT price,quantity,sellerID FROM orderp WHERE ID = ? ",[idii],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            var pp = results[0].price;
            var qp = results[0].quantity;
            var sid = results[0].sellerID;
            db.query("SELECT Eth_Address FROM seller WHERE ID = ?",[sid],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    db.query("UPDATE orderp SET status='3' WHERE ID = ?",[[idii]],(error,results2) =>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log(results1[0]);
                            const add = results1[0].Eth_Address;
                            file.sellerAdd = add;
                            file.price = pp*qp/100;
                            file.email = global_username_A;
                            file.ind = 0;
                            fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
                            if (err) return console.log(err);
                            console.log(JSON.stringify(file));
                            console.log('writing to ' + fileName);
                            });
                            var url = "http://localhost:3000";
                            res.redirect(url);
                        }
                    });
                    
                }
            });
		}
	});
});



// SCORE = 4*(Most frequent)+3*(Last session)+2*(Similar buys)


// Here is the approach for the recommendation part.
  // For general top picks, find the most frequented category, then apply the ml model to it with similar buys to get this.
  // For pick up where you left off use last session data on the same product list(most freq).

  app.post("/topPick",(req,res)=>{

    db.query("SELECT id FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT type1,type2,type3,type4 FROM mostfreq WHERE userID = ?",[id11],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    let a = results1[0].type1;
                    let b = results1[0].type2;
                    let c = results1[0].type3;
                    let d = results1[0].type4;
                    let x = Math.max(a,b,c,d);
                    let f = 0;
                    if(a===x){
                        f=1;
                    }
                    else if(b===x){
                        f=2;
                    }
                    else if(c===x){
                        f=3;
                    }
                    else if(d===x){
                        f=4;
                    }
                    db.query("SELECT ID,Name,Descp FROM product WHERE CategoryID = ? ",[f],(error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results2.length >0){
                            db.query("SELECT prodID FROM orderp WHERE userID = ? ORDER BY ID DESC ",[id11],(error,results3)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results3.length >0){
                                    const id1 = results3[0].prodID;
                                    console.log(id1);
                                    db.query("SELECT Name,Descp FROM product WHERE ID = ?",[id1],(error,results4)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        if(results4.length >0){
                                            console.log("he eh");
                                            const descp1 = results4[0].Descp;
                                            const name1 = results4[0].Name;
                                            let newId = results2[results2.length-1].ID;
                                            newId++;
                                            descpA = [];
                                            nameA =[];
                                            for(let i=0;i<results2.length;i++){
                                                nameA.push([results2[i].ID,results2[i].Name]);
                                            }
                                            for(let i=0;i<results2.length;i++){
                                                descpA.push([results2[i].ID,results2[i].Descp]);
                                            }
                                            descpA.push([newId,descp1]);
                                            nameA.push([newId,name1]);
                                            console.log(descp1);
                                            // console.log(nameA);
                                            let idii1 = newId.toString();
                                            const algo = new recommender();
                                            const data = algo.train(descpA);
                                            const ans1 = algo.getSimilarDocuments(idii1,data);
                                            const data1 =algo.train(nameA);
                                            const ans2 =algo.getSimilarDocuments(idii1,data1);
                                            // console.log("he eh");
                                            // console.log(ans1);
                                            // console.log(ans2);
                                            const ans = ans1.concat(ans2);
                                            // console.log(ans);
                                            var arr =[];
                                            const sett = new Set();
                                            for(let i=0;i<ans1.length;i++){
                                                sett.add(ans1[i].id);
                                            }
                                            for(let i=0;i<ans2.length;i++){
                                                sett.add(ans2[i].id);
                                            }
                                            for(let i of sett){
                                                arr.push(i);
                                            }
                                            console.log(arr);
                                            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                                                if(error){
                                                    console.log(error);
                                                }
                                                if(results.length >0){
                                                    // console.log(results);
                                                    // console.log(results1);
                                                    return res.render("display.hbs",{
                                                        results:results
                                                    }); 
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Continue where you left off

app.post("/contLeft",(req,res)=>{

    db.query("SELECT id FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT type1,type2,type3,type4 FROM mostfreq WHERE userID = ?",[id11],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    let a = results1[0].type1;
                    let b = results1[0].type2;
                    let c = results1[0].type3;
                    let d = results1[0].type4;
                    let x = Math.max(a,b,c,d);
                    let f = 0;
                    if(a===x){
                        f=1;
                    }
                    else if(b===x){
                        f=2;
                    }
                    else if(c===x){
                        f=3;
                    }
                    else if(d===x){
                        f=4;
                    }
                    db.query("SELECT ID,Name,Descp FROM product WHERE CategoryID = ? ",[f],(error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results2.length >0){
                            db.query("SELECT id1 FROM user WHERE ID = ? ",[id11],(error,results3)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results3.length >0){
                                    const id1 = results3[0].id1;
                                    console.log(id1);
                                    db.query("SELECT Name,Descp FROM product WHERE ID = ?",[id1],(error,results4)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        if(results4.length >0){
                                            console.log("he eh");
                                            const descp1 = results4[0].Descp;
                                            const name1 = results4[0].Name;
                                            let newId = results2[results2.length-1].ID;
                                            newId++;
                                            descpA = [];
                                            nameA =[];
                                            for(let i=0;i<results2.length;i++){
                                                nameA.push([results2[i].ID,results2[i].Name]);
                                            }
                                            for(let i=0;i<results2.length;i++){
                                                descpA.push([results2[i].ID,results2[i].Descp]);
                                            }
                                            descpA.push([newId,descp1]);
                                            nameA.push([newId,name1]);
                                            console.log(descp1);
                                            // console.log(nameA);
                                            let idii1 = newId.toString();
                                            const algo = new recommender();
                                            const data = algo.train(descpA);
                                            const ans1 = algo.getSimilarDocuments(idii1,data);
                                            const data1 =algo.train(nameA);
                                            const ans2 =algo.getSimilarDocuments(idii1,data1);
                                            // console.log("he eh");
                                            // console.log(ans1);
                                            // console.log(ans2);
                                            const ans = ans1.concat(ans2);
                                            // console.log(ans);
                                            var arr =[];
                                            const sett = new Set();
                                            for(let i=0;i<ans1.length;i++){
                                                sett.add(ans1[i].id);
                                            }
                                            for(let i=0;i<ans2.length;i++){
                                                sett.add(ans2[i].id);
                                            }
                                            for(let i of sett){
                                                arr.push(i);
                                            }
                                            console.log(arr);
                                            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                                                if(error){
                                                    console.log(error);
                                                }
                                                if(results.length >0){
                                                    // console.log(results);
                                                    // console.log(results1);
                                                    return res.render("display.hbs",{
                                                        results:results
                                                    }); 
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


// main dashboard rendering begins:


app.get("/dash_render",(req,res)=>{

    db.query("SELECT id FROM user WHERE email = ?",[global_username],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            let id11=results[0].id;
            console.log(id11);
            db.query("SELECT type1,type2,type3,type4 FROM mostfreq WHERE userID = ?",[id11],(error,results1)=>{
                if(error){
                    console.log(error);
                }
                if(results1.length >0){
                    let a = results1[0].type1;
                    let b = results1[0].type2;
                    let c = results1[0].type3;
                    let d = results1[0].type4;
                    let x = Math.max(a,b,c,d);
                    let f = 0;
                    if(a===x){
                        f=1;
                    }
                    else if(b===x){
                        f=2;
                    }
                    else if(c===x){
                        f=3;
                    }
                    else if(d===x){
                        f=4;
                    }
                    db.query("SELECT ID,Name,Descp FROM product WHERE CategoryID = ? ",[f],(error,results2)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results2.length >0){
                            db.query("SELECT id1 FROM user WHERE ID = ? ",[id11],(error,results3)=>{
                                if(error){
                                    console.log(error);
                                }
                                if(results3.length >0){
                                    const id1 = results3[0].id1;
                                    console.log(id1);
                                    db.query("SELECT Name,Descp FROM product WHERE ID = ?",[id1],(error,results4)=>{
                                        if(error){
                                            console.log(error);
                                        }
                                        if(results4.length >0){
                                            console.log("he eh");
                                            const descp1 = results4[0].Descp;
                                            const name1 = results4[0].Name;
                                            let newId = results2[results2.length-1].ID;
                                            newId++;
                                            descpA = [];
                                            nameA =[];
                                            for(let i=0;i<results2.length;i++){
                                                nameA.push([results2[i].ID,results2[i].Name]);
                                            }
                                            for(let i=0;i<results2.length;i++){
                                                descpA.push([results2[i].ID,results2[i].Descp]);
                                            }
                                            descpA.push([newId,descp1]);
                                            nameA.push([newId,name1]);
                                            console.log(descp1);
                                            // console.log(nameA);
                                            let idii1 = newId.toString();
                                            const algo = new recommender();
                                            const data = algo.train(descpA);
                                            const ans1 = algo.getSimilarDocuments(idii1,data);
                                            const data1 =algo.train(nameA);
                                            const ans2 =algo.getSimilarDocuments(idii1,data1);
                                            // console.log("he eh");
                                            // console.log(ans1);
                                            // console.log(ans2);
                                            const ans = ans1.concat(ans2);
                                            // console.log(ans);
                                            var arr =[];
                                            const sett = new Set();
                                            for(let i=0;i<ans1.length;i++){
                                                sett.add(ans1[i].id);
                                            }
                                            for(let i=0;i<ans2.length;i++){
                                                sett.add(ans2[i].id);
                                            }
                                            for(let i of sett){
                                                arr.push(i);
                                            }
                                            console.log(arr);
                                            db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results)=>{
                                                if(error){
                                                    console.log(error);
                                                }
                                                if(results.length >0){
                                                    // console.log(results);
                                                    // console.log(results1);
                                                    db.query("SELECT prodID FROM orderp WHERE userID = ? ORDER BY ID DESC ",[id11],(error,results7)=>{
                                                        if(error){
                                                            console.log(error);
                                                        }
                                                        if(results7.length >0){
                                                            const id1 = results7[0].prodID;
                                                            console.log(id1);
                                                            db.query("SELECT Name,Descp FROM product WHERE ID = ?",[id1],(error,results8)=>{
                                                                if(error){
                                                                    console.log(error);
                                                                }
                                                                if(results8.length >0){
                                                                    console.log("he eh");
                                                                    const descp1 = results8[0].Descp;
                                                                    const name1 = results8[0].Name;
                                                                    let newId = results2[results2.length-1].ID;
                                                                    newId++;
                                                                    descpA = [];
                                                                    nameA =[];
                                                                    for(let i=0;i<results2.length;i++){
                                                                        nameA.push([results2[i].ID,results2[i].Name]);
                                                                    }
                                                                    for(let i=0;i<results2.length;i++){
                                                                        descpA.push([results2[i].ID,results2[i].Descp]);
                                                                    }
                                                                    descpA.push([newId,descp1]);
                                                                    nameA.push([newId,name1]);
                                                                    console.log(descp1);
                                                                    // console.log(nameA);
                                                                    let idii1 = newId.toString();
                                                                    const algo = new recommender();
                                                                    const data = algo.train(descpA);
                                                                    const ans1 = algo.getSimilarDocuments(idii1,data);
                                                                    const data1 =algo.train(nameA);
                                                                    const ans2 =algo.getSimilarDocuments(idii1,data1);
                                                                    // console.log("he eh");
                                                                    // console.log(ans1);
                                                                    // console.log(ans2);
                                                                    const ans = ans1.concat(ans2);
                                                                    // console.log(ans);
                                                                    var arr =[];
                                                                    const sett = new Set();
                                                                    for(let i=0;i<ans1.length;i++){
                                                                        sett.add(ans1[i].id);
                                                                    }
                                                                    for(let i=0;i<ans2.length;i++){
                                                                        sett.add(ans2[i].id);
                                                                    }
                                                                    for(let i of sett){
                                                                        arr.push(i);
                                                                    }
                                                                    console.log(arr);
                                                                    db.query("SELECT ID,Name,CategoryID,Inventory,Price,Descp,Img FROM product WHERE ID IN (?) ",[arr],(error,results10)=>{
                                                                        if(error){
                                                                            console.log(error);
                                                                        }
                                                                        if(results10.length >0){
                                                                            // console.log(results);
                                                                            // console.log(results1);
                                                                            return res.render("shopPage.hbs",{
                                                                                results:results,results10:results10
                                                                            }); 
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
