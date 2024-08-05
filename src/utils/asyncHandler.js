


// export const asyncHnadler=(requestHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next).catch((err)=>next(err)))
//     }


// }


export const asyncHnadler=(requestHandler)=>async(req,res,next)=>{
    try{
        await requestHandler(req,res,next)
    }
    catch(error){
        res.status(err.code || 400).json({
            success:false,
            message:err.message
        })
    }
}
