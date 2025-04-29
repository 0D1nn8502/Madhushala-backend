import express, {Request, Response} from "express"; 
import { authenticateToken } from "../middleware/User"; 
import { createSpaceSchema } from "../schemas";
import {ObjectId} from "mongodb"; 
import cors from "cors"; 
import {SpaceModel} from "../../models/Space";
import {UserModel} from "../../models/UserModel";
import { SpaceElementModel, ElementModel } from "../../models/Element"; 


const spaceRouter = express.Router(); 
spaceRouter.use(express.json()); 

spaceRouter.use(cors()); 


spaceRouter.get('/elements', authenticateToken, async(req: Request, res: Response) => {
    try {
        const elements = await ElementModel.find(); 
        res.status(200).json(elements); 
        
    } catch (error) {
        console.error("Error fetching elements:", error); 
        res.status(500).json({message: "Internal server error"}); 
    }
}); 


// Create New Space // 

spaceRouter.post('/create', authenticateToken, async (req, res) => {
    try {
        const parsedData = createSpaceSchema.safeParse(req.body);  
        
        if (!parsedData.success) {
            console.log(JSON.stringify(parsedData))
            res.status(400).json({message: "Validation failed"});
            return; 
        }

        // Check spaces quota // 
        const user = await UserModel.findById(req.userId);   
        if (!user) {
            res.status(404).json({message: "User not found"}); 
            return; 
        }


        if (user.spaces.length > 0) {
            res.status(400).json({message: "Only one space per user as of now"});
            return;  
        }

        const {name, spaceElements} = parsedData.data; 

        // Convert elementId to ObjectId
        const processedElements = spaceElements.map(spaceElement => ({
            ...spaceElement,
            elementId: ObjectId.createFromHexString(spaceElement.elementId) // Convert elementId to ObjectId
        })); 

        // Create new space // 
        const newSpace = new SpaceModel({
            name,
            ownerId: req.userId,
            spaceElements: processedElements 
        }); 

        const savedSpace = await newSpace.save(); 

        // Check if savedSpace is defined
        if (!savedSpace) {
            res.status(500).json({ message: "Failed to create space in the database" });
            return; 
        } 

        // Add to user's spaces //  
        user.spaces.push({
            spaceId: savedSpace._id as ObjectId,
            spaceName: name 
        });  
        await user.save()

        res.status(201).json({ 
            message: "Space created successfully", 
            spaceId: savedSpace._id,  
            space: savedSpace 
        });

    } catch (error) {
        console.error("Error creating space:", error);
        res.status(500).json({ message: error });
    }
});


// Join Space // 
spaceRouter.get('/join/:spaceId', authenticateToken, async (req: Request, res: Response) => {
    try { 
        const spaceId = new ObjectId(req.params.spaceId);
        const userId = req.userId;

        // Find the space
        const space = await SpaceModel.findById(spaceId);
        
        if (!space) {
           res.status(404).json({ message: "Space not found" });
           return; 
        }

        // TO DO : (Permission Checks) //  

        res.status(200).json({ 
            spaceId : space._id, 
            name: space.name, 
            spaceElements: space.spaceElements 
        }); 

    } catch (error) {
        console.error("Error joining space:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Online Spaces // 
spaceRouter.get('/online', authenticateToken, async (req: Request, res: Response) => {
    try {
        // Find all spaces that are online
        const onlineSpaces = await SpaceModel.find({ isOnline: true })
            .populate('ownerId', 'username')
            .select('name ownerId isOnline');
        
        // Format the response (userName can later be included) // 
        const formattedSpaces = onlineSpaces.map(space => ({
            _id: space._id,
            name: space.name,
            owner: (space.ownerId as any).username,   // Probably not safe // 
            isOnline: space.isOnline
        }));
        
        res.status(200).json(formattedSpaces);
    } catch (error) {
        console.error("Error fetching online spaces:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default spaceRouter; 

