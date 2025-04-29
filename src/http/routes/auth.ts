import express, {Request, Response} from "express";
import {UserModel} from "../../models/UserModel";
import cors from "cors";
import bcrypt from "bcrypt";
import { JWT_PASSWORD } from "../config";
import { signupSchema, signinSchema } from "../schemas";
import jwt from "jsonwebtoken"; 

let numSignedin = 0; 

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.use(cors());

// Signup // 
authRouter.post("/signup", async (req : Request, res : Response) => { 

    const request = signupSchema.safeParse(req.body); 

    if (!request.success) {
      res.status(400).json({
        error: "Not parsed" 
      });
      console.log(request.error); 
      return;
    } 

    const { username, email, password } = request.data; 

    // Check if the username or email already exists using UserModel
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
         res.status(400).json({ error: "Choose a different username" });
         return; 
      }

      // If email exists // 
      if (existingUser.email === email) {
        res.status(400).json({ error: "Email already registered. Try signing in!" });
        return; 
      }  
    } 

    const HashedPass = await bcrypt.hash(password, 10); 

    if (!HashedPass) {
      res.status(400).json({error : "Error hashing password"}) 
      return; 
    }

    const newUser = new UserModel({
      username : username, 
      email : email, 
      spaces : [], 
      description : "A brief intro",    
      passwordHash : HashedPass,  // Store hashed password // 
      image : "https://madhushala-bucket.s3.ap-south-1.amazonaws.com/profilepics/fallen.jpg", 
      avatar: "https://madhushala-bucket.s3.ap-south-1.amazonaws.com/avatars/dude.png"  
    });

    const result = await newUser.save();

    if (result) {

      // Generate JWT token // 
      const token = jwt.sign(
        { userId: result._id, name: newUser.username },
         JWT_PASSWORD,
       { expiresIn: "3h" } 
      );

      res.status(201).json({
        message: 'Sign up successful', 
        token,
        user : {
          username : newUser.username, 
          spaces : newUser.spaces, 
          image: newUser.image, 
          avatar: newUser.avatar 
        }
      });
      return; 

    } else {
        res.status(500).json({error : "Sign up failed."});
        return; 
    } 

})


// Signin //  
authRouter.post("/signin", async (req: Request, res: Response) => {

  try {
    
    const request = await signinSchema.safeParse(req.body); 

    if (!request.success) {
      res.status(400).json({error : "Validation failed "}) 
      return; 
    }

    const {username, password} = request.data; 
    const user = await UserModel.findOne({username}); 

    if (!user) {
      res.status(401).json({error : "Username does not exist"}); 
      return; 
    }

    const passValid = await bcrypt.compare(password, user.passwordHash); 
    if (!passValid) {
      res.status(401).json({error : "Incorrect password"});  
      return; 
    }

    // Generate Jwt // 
    const token = jwt.sign(
      {userId : user._id, name : user.username}, 
      JWT_PASSWORD, 
      {expiresIn : '3h'} 
    ); 

    numSignedin += 1 
    console.log("Signed in : ", numSignedin); 

    res.status(200).json({
      message : 'Success', 
      token, 
      user : {
        username : user.username, 
        email : user.email, 
        image : user.image, 
        spaces : user.spaces, 
        description : user.description, 
        avatar: user.avatar 
      } 
    })

  } catch (error) {
    console.error('Error during sign in : ', error) 
    res.status(500).json({error : "Sign in unsuccessful"});   
  }

});



export default authRouter; 