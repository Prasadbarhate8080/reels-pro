import { connectToDatabase } from "@/lib/db"
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function  GET(){
    try {
        await connectToDatabase();
        const video = await Video.aggregate([{$sample:{size:1}}])
        return NextResponse.json({message:"video sent successfully",data:video},{status:200})
    } catch (error) {
        console.log("error in getting videos",error)
    }
}