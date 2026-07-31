import env from "../../Config/config.js";

export const ErrorResponse = (
    {
        status = 400,
        message = "Something went wrong!",
        extra = undefined
    } = {} // 3mlt {} fady 3shan lw 7aga mn eli ktbthom mtb3tsh zy el Extra mydrbsh error
)=>{
    throw new Error(message , {cause: {status, extra}});
};





export const BadRequestException = (
    { message= "Bad request", extra= undefined }= {}
)=>{
    return ErrorResponse({ status: 400, message: message, extra: extra});
};

export const NotFoundException = (
    { message= "Not Found Error", extra= undefined }= {}
)=>{
    return ErrorResponse({ status: 404, message: message, extra: extra});
};

export const ConflictException = (
    { message= "Confilct Error", extra= undefined }= {}
)=>{
    return ErrorResponse({ status: 409, message: message, extra: extra});
};

export const UnauthorizedException = (
    { message= "Unauthorized Error", extra= undefined }= {}
)=>{
    return ErrorResponse({ status: 401, message: message, extra: extra});
};

export const ForbiddenException = (
    { message= "Forbidden Error", extra= undefined }= {}
)=>{
    return ErrorResponse({ status: 403, message: message, extra: extra});
};




export const globalHandlingError = (err, req, res, next)=>{
    const mood = env.mood == "dev";

    // 3shan lw rg3 error mn javascript nfsha
    const status = err.status? err.status : err.cause? err.cause.status : 500;

    const defaultMessage = "Something went wrong!!";
    const displayMessage = err.message || defaultMessage;
    
    
    res.status(status).json({
        message: mood? displayMessage : defaultMessage, 
        stack: mood? err.stack : null,
        extra: mood? err.cause: null
    });
};