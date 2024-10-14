import User from "../models/user.model.js";
import bcrypt from "bcrypt.js"

export const signup = async (req, res) => {
    try{
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid Email format"});
        }

        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({error: "Username is already taken"})
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({error: "Email is already taken"})
        }

        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.fullName,
                email: username.email,
                followers: username.followers,
                following: username.following,
                profileImg: username.profileImg,
                coverImg: username.coverImg,
            });
        }else{
            res.status(400).json({error: "Invalid user data"});
        }

    }catch(error){
        console.log("Error in signup controller", error.message);

        res.status(400).json({error: "Interval server error"});
    }
}

export const login = async (req, res) => {
    res.json({
        data: "You hit the login endpoint"
    });
}

export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout endpoint"
    });
}