import jwt from "jsonwebtoken";
import env from "../../Config/config.js";

// ASSIGNMENT 11

export const auth = async (req, res, next)=>{
    let {authorization} = req.headers;
    let [flag, token] = authorization.split(" ");                           //

    switch (flag) {                                                                //
        case "Basic":                                                             //
            const basicData = Buffer.from(token, "base64").toString();              //
            let [email, password] = basicData.split(":");               //
            console.log(email, password);               //
            break;              //
                    //
        case "Bearer":              //
            let decodeData = await jwt.decode(token)
            let signature = "";
            switch (decodeData.aud[0]) {
                case 0:
                    signature = env.userSignature
                    break;
                case 1:
                    signature = env.adminSignature
                    break;
                default:
                    break;
            }
            let decoded = await jwt.verify(token, signature);
            req.userData = decoded.userId;
            req.decoded = decoded;
            req.token = token;
            next();
    
        default:     //
            break;    //
    }                   //

    
    
};

export const generateToken = async (payload, host, role)=>{
    let signature = "";
    let refreshSignature = "";

    switch (role) {
        case 0:
            signature = env.userSignature;
            refreshSignature = env.userRefToken;
            break;
        
        case 1: 
            signature = env.adminSignature;
            refreshSignature= env.adminRefToken;
            break;
    
        default:
            break;
    }

    let accessToken = await jwt.sign(payload, signature, 
        {
            expiresIn: "30mins",
            issuer: host,
            audience: [role]
        }
    );

    let refreshToken = jwt.sign(payload, refreshSignature,
        {
            expiresIn: "1y",
            issuer: host,
            audience: [role]
        }
    );
    return {accessToken, refreshToken};
};


export const generateAccessToken = async(refreshToken, host)=>{

    let decode = await jwt.decode(refreshToken);
    let signature= "";
    
    
    switch (decode.aud[0]) {
        case 0:
            signature = env.userSignature;
            break;
        
        case 1: 
            signature = env.adminSignature;
            break;
    
        default:
            break;
    };

    let accessToken = await jwt.sign({userId: decode.userId}, signature, 
        {
            expiresIn: "30mins",
            issuer: host,
            audience: [decode.aud[0]]
        }
    );

    return accessToken;
}