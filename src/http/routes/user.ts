import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/User";
import { UserModel } from "../../models/UserModel";

const userRouter = express.Router();
userRouter.use(express.json());

// Route to fetch user profile
userRouter.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Find user and exclude email and password fields
    const user = await UserModel.findById(req.userId).select('-email -passwordHash'); 
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; 
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
