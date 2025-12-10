import bcrypt from 'bcrypt';
import {cookies} from 'next/headers';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req){
const client = await clientPromise;
const {email, password} = await req.json();
const db=client.db("auth");
const collection=db.collection("users");
const  user  = await collection.findOne({email});
if(!user){
    const reject ={message:"User not registered. Complete registration first"};
    return Response.json(reject,{status:404});
}
    else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
              const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
          const cookieStore =await cookies();
   
   cookieStore.set("token", token, {
            httpOnly:true,
            secure:true,
            path:"/",
            domain: process.env.COOKIE_DOMAIN,
            maxAge:60*60*7*24,
            sameSite:"lax"
          });
         

            return Response.json({message:"success"},{status:200});
        }else{return Response.json({message:"login failed"},{status:401});}
        
    }
}