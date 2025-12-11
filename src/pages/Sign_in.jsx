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

function Login({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${BASEURL}/api/login/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onSubmit) onSubmit();
          navigate("/home")
      } else {
        setErrorMsg("Invalid credentials");
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
        width={["90%", "350px"]}
        minH="450px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Heading mb={6} textAlign="center">
          Sign In
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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
              Log In
            </Button>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Don't have an account?{" "}
              <Link to="/sign_up" style={{ color: "teal" }}>
                Sign Up
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default Login;


