import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import BASEURL from "./Base";


export default function Navbar() {
  const navigate = useNavigate();
  

  async function handleLogout() {
    try {
      await fetch(`${BASEURL}api/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      navigate("/");
    }
  }

  return (
    <Box bg="blue.600" py="12px" px="20px" shadow="sm" mb="30px">
      <Flex justify="space-between" align="center" maxW="900px" mx="auto">
        <Heading
          size="md"
          color="white"
          cursor="pointer"
          onClick={() => navigate("/home")}
        >
          DevTracker
        </Heading>

        <Flex gap="12px">
          <Link to="/home">
            <Button size="sm" colorScheme="whiteAlpha">
              Home
            </Button>
          </Link>

          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
