import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Username check
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserByUsername) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 },
      );
    }

    // Email check
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already exists" },
          { status: 400 },
        );
      } else {
        // update user
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifiedExpiry = expiryDate;

        await existingUserByEmail.save();
      }
    } else {
      // create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifiedExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered. Please verify your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/*
Title: Implement User Signup with Email Verification

Description:
- Create a signup endpoint
- Validate input fields (username, email, password)
- Check for duplicate username and email
- Handle unverified users by updating their record
- Generate OTP and expiry time
- Send OTP via email
- Store user with hashed password
- Return standard API response

Acceptance Criteria:
- User cannot register with existing verified email
- OTP should expire after 10 minutes
- Email must be sent successfully
- API should return success and error messages properly
*/
