import {customeMessage} from "./App";
export const isValidEmail = (em) => em.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const isValidPass = (pass) => pass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
const formValidation = (obj) => {
    let {fname,lname,phone,password,gender} = obj;
    if(fname === "" || fname.length > 50){
        customeMessage("first name must be less then 50 characters");
        return false;
    }else if(lname === "" || lname.length > 50){
        customeMessage("last name must be less then 50 characters");
        return false;
    }else if(phone.length !== 10){
        customeMessage("phone number is must be 10 characters");
        return false;
    }else if(!isValidPass(password)){
        customeMessage("password Minimum eight characters, at least one uppercase letter, one lowercase letter and one number");
        return false;
    }else if(gender === ""){
        customeMessage("please select gender");
        return false;
    }else{
        return true;
    }
}
export default formValidation;