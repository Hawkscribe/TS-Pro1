import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import {Request,Response, NextFunction } from "express";

export const middleware=(req:Request,res:Response,next:NextFunction)=>{
const header=req.headers["authorization"];
console.log(header);
try {
    const decoded=jwt.verify(header as string,JWT_PASSWORD);
    console.log(decoded);
    if (decoded) {
        //@ts-ignore
        req.userId=decoded.id;
        next();
    }
} catch (error) {
    res.status(500).json({msg:"Middleware throwing error.Unauthorised acess"});
    return;
}
}