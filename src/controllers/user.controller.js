import { ApiError } from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = (asyncHandler,async (req, res) =>{
   const {fullName , email , username, password} = req.body;
   console.log("email:",email)
  if(
    [fullName, email, username, password].some((field) => 
   field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are requried"); 
  }

  const existUser = await User.findOne({
    $or: [{ username}, {email}]
  });

  if(existUser){

    throw new ApiError( 409, "User with email or username already exist");
  };

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath = req.files.coverImage[0].path;
  };

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  };
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar) 
   {
    throw new ApiError(400, "avatar is requried");
   };

  const user =  await  User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()

   });

   const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
   );

if(!createUser){
    throw new ApiError(500, "Something went wrong while registring a user");
};

return res.status(201).json(
    new ApiResponse(200, createUser, "User registred successfully")
);

});

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

   user.refreshToken = refreshToken
   await user.save({validateBeforeSave: false});

   return {accessToken, refreshToken};

  }catch (error){
    throw new ApiError(500, "Something went wrong while genreting refresh and access token");
  }
}

const loginUser = (asyncHandler,async (req, res) =>{

  const {email , username, password}  = req.body;

  if(!username && !email){
    throw new ApiError(400, "username or email is required");
  };

  const user = await User.findOne({
    $or : [ {username}, {email}]
  })

  if(!user){
    throw new ApiError(404, "user doesn`t exits")
  };

  const isPasswordValid = await user.isPasswordValid(password);

  if(!isPasswordValid){
    throw new ApiError(401, "invaild user credentials");
  };

  const {accessToken, refreshToken} = await 
  generateAccessAndRefreshTokens(user._id);
const loggedInUser = await User.findById|(user._id).
select("-password  -refreshToken");

const options  = {
  httpOnly: true,
  secure: true 
};

return res.status(200).cookie("accesssToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200, 
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "user logged in successfully"
  )
);


});

const logoutUser = (asyncHandler, async( req, res) =>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }

    },
    {
      new: true
    }
   )

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshtoken", options)
   .json(new ApiResponse(200, {}, "user logged out"));

})

export {registerUser, loginUser, logoutUser};