import {
  Html,
  Head,
  Preview,
  Heading,
  Body,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP code is {otp}</Preview>

      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Heading>Welcome, {username} 👋</Heading>

        <Text>
          Thank you for signing up. Please use the verification code below to
          verify your account:
        </Text>

        <Heading
          style={{
            textAlign: "center",
            letterSpacing: "5px",
          }}
        >
          {otp}
        </Heading>

        <Text>This code will expire in 10 minutes.</Text>

        <Text>If you did not request this, please ignore this email.</Text>
      </Body>
    </Html>
  );
}
