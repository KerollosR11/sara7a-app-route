export const SuccessResponse = (
    {res, message="Done", statusCode = 200, data = undefined} 
)=>{
    res.status(statusCode).json({message , data});
};