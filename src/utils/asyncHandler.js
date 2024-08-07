const asyncHnadler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHnadler }



// export const asyncHnadler=(requestHandler)=>async(req,res,next)=>{
//     try{
//         await requestHandler(req,res,next)
        
//     }
//     catch(error){
//         res.status(450).json({
//             success:false,
//             message:error.message
//         })
//     }
// }
