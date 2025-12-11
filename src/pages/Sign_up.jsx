import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import BASEURL from "../Base";

function SignUp() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Register the user
      const res = await fetch(`${BASEURL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 2️⃣ Log the user in automatically
        const loginRes = await fetch(`${BASEURL}api/login/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.success) {
          navigate("/home"); // redirect to home
        } else {
          setErrorMsg("Registration succeeded, but login failed.");
        }
      } else {
        // Combine all errors into one string
        const messages = [];
        for (const key in data) {
          messages.push(`${key}: ${data[key].join(" ")}`);
        }
        setErrorMsg(messages.join(" | "));
      }
    } catch (err) {
      setErrorMsg("Server error");
    }

    setLoading(false);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        width={["90%", "400px"]}
        minH="550px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Heading mb={6} textAlign="center">
          Sign Up
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              type="password"
              required
            />

            {errorMsg && (
              <Text color="red.500" fontSize="sm">
                {errorMsg}
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={loading}
            >
              Sign Up
            </Button>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Already have an account?{" "}
              <Link to="/" style={{ color: "teal" }}>
                Sign In
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default SignUp;
