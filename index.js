const http = require("http");
const fs = require("fs");
const file_path = "./user.json";
const getUniqueId = () => {
    let num = Math.floor(Math.random()*100000);
    if (num < 100){num = num+100}
    return num;
}
const storeData = (data) => {
    data = {id:getUniqueId(),...data,email:data.email.toLowerCase()}
    try{
        // First Check File Already Exists Or Not
        if(fs.existsSync(file_path)){
            // What To Do If Already Exists
            const old_json = fs.readFileSync(file_path,"utf-8");
            let old_obj = JSON.parse(old_json);
            const isEmailExists = old_obj.some((val) => val.email == data.email);
            if(isEmailExists){
                return {status:false,message:"Email Already Exists !"};
            }else{
                old_obj.push(data);
                fs.writeFileSync(file_path,JSON.stringify(old_obj,null,4));
                return {status:true,message:"data inserted successfully"};
            }
        }else{
            // What To Do If Not Already Exists
            const arr = [];
            arr.push(data);
            const new_data = JSON.stringify(arr,null,4);
            fs.writeFileSync(file_path,new_data);
            return {status:true,message:"data inserted successfully"};
        }
    }catch(err){
        return {status:false,message:`data not inserted Error Is ${err}`};
    }
}

const updateData = (data) => {
    data = {...data,email:data.email.toLowerCase()}
    try{
        // First Check File Already Exists Or Not
        if(fs.existsSync(file_path)){
            // What To Do If Already Exists
            const old_json = fs.readFileSync(file_path,"utf-8");
            let old_obj = JSON.parse(old_json);
            const isEmailExists = old_obj.some((val) => (val.email == data.email && val.id !== data.id));
            if(isEmailExists){
                return {status:false,message:"Email Already Registered !"};
            }else{
                let updated_obj = old_obj.map((val) => {
                    if(val.id == data.id){
                        return {...val,...data}
                    }
                    return val;
                });
                fs.writeFileSync(file_path,JSON.stringify(updated_obj,null,4));
                return {status:true,message:"data updated successfully"};
            }
        }else{
            return {status:false,message:"file does not exists"};
        }
    }catch(err){
        return {status:false,message:`data not updated Error Is ${err}`};
    }
}

const isValidEmail = (em) => em.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const isValidPass = (pass) => pass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
const allDataIsValid = (data) => {
    try{
        let {fname,lname,email,phone,password,gender} = JSON.parse(data);
        fname = fname.trim();
        lname = lname.trim();
        email = email.trim();
        phone = phone.trim();
        password = password.trim();
        gender = gender.trim();
        if(fname === "" || fname.length > 50){
            return {status:false,message:"first name must be less then 50 characters"}
        }else if(lname === "" || lname.length > 50){
            return {status:false,message:"last name must be less then 50 characters"}
        }else if(!isValidEmail(email)){
            return {status:false,message:"email is invalid"}
        }else if(phone.length !== 10){
            return {status:false,message:"phone number is must be 10 characters"}
        }else if(!isValidPass(password)){
            return {status:false,message:"password Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"}
        }else if(gender === ""){
            return {status:false,message:"please select gender"}
        }else{
            return {status:true,message:"Validation Is Ok"}
        }
    }catch(err){
        return {status:false,message:"Something Is Wrong With Data"}
    }
}
// 4 STEP Create NodeJs Server
const server = http.createServer((req,res) => {
    try{
        if(req.method === "GET"){
            if(req.url == "/user/get"){
                if(fs.existsSync(file_path)){
                    res.end(fs.readFileSync(file_path,"utf-8"));
                }else{
                    res.end(JSON.stringify([]));
                }
            }else{
                res.end(JSON.stringify({status:false,message:"Wrong GET Request ! Please Check Requested URL"}));
            }
        }else{
            res.setHeader("Content-Type","application/json");
            const chunks = [];
            req.on("data",(chunk) => {
                chunks.push(chunk);
            });
            if(req.method === "POST"){
                req.on("end",() => {
                    const data = Buffer.concat(chunks);
                    const main_data = data.toString();
                    if(req.url == "/user/set"){
                        const isValid = allDataIsValid(main_data);
                        isValid.status ? res.end(JSON.stringify(storeData(JSON.parse(main_data)))):res.end(JSON.stringify(isValid.message));
                    }else{
                        res.end(JSON.stringify({status:false,message:"Wrong POST Request !"}));
                    }
                });
            }else if(req.method === "PATCH"){
                req.on("end",() => {
                    const data = Buffer.concat(chunks);
                    const main_data = data.toString();
                    if(req.url == "/user/update"){
                        const isValid = allDataIsValid(main_data);
                        isValid.status ? res.end(JSON.stringify(updateData(JSON.parse(main_data)))):res.end(JSON.stringify(isValid.message));
                    }else{
                        res.end(JSON.stringify({status:false,message:"Wrong PATCH Request !"}));
                    }
                });
            }else if(req.method === "DELETE"){
                req.on("end",() => {
                    const data = Buffer.concat(chunks);
                    const main_data = data.toString();
                    if(req.url == "/user/delete"){
                        let {id} = JSON.parse(main_data);
                        if(id && !isNaN(id)){
                            const old_json = fs.readFileSync(file_path,"utf-8");
                            let old_obj = JSON.parse(old_json);
                            let updated_obj = old_obj.filter((val) => val.id !== id);
                            fs.writeFileSync(file_path,JSON.stringify(updated_obj,null,4));
                            res.end(JSON.stringify({status:true,message:"data deleted successfully"}));
                        }else{
                            res.end(JSON.stringify({status:false,message:"User Id Is Missing !"}));
                        }
                    }else{
                        res.end(JSON.stringify({status:false,message:"Wrong DELETE Request !"}));
                    }
                });
            }else{
                res.end(JSON.stringify({status:false,message:"Request Method Is Wrong !"}));
            }
        }
    }catch(err){
        res.statusCode(500).end(JSON.stringify({status:false,message:`Server Error Occured ! ${err}`}));
    }
});
server.listen(5000,() => {
    console.log("node server running");
})