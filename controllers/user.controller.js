import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.error(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    const user =  await User.findOne({ email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User does not exist"
        })
    }
    const isPasswordValid = await bcrypt.compare(String(password),user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message:"Invalid password"
        })
    }
    return res.status(200).json({
        success:true,
        message:"user logged in successfully",
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.error(error);
  }
};
