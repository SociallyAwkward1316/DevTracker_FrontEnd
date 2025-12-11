import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASEURL from "../Base";
import Navbar from "../navbar";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`${BASEURL}api/project_list/`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  async function createProject() {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(`${BASEURL}api/create_project/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Project created!");
        setProjects([...projects, data]);
        setNewTitle("");
        setNewDesc("");
      } else {
        toast.error("Error creating project");
      }
    } catch (err) {
      toast.error("Server error");
    }
  }

  async function deleteProject(id) {
    try {
      const res = await fetch(`${BASEURL}api/project/${id}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.error("Project deleted");
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete project");
      }
    } catch (err) {
      toast.error("Server error");
    }
  }

  return (
    <>
      <Navbar />

      <Box bg="gray.100" minH="100vh" py="40px">
        <Box
          maxW="900px"
          mx="auto"
          bg="white"
          p="28px"
          rounded="md"
          shadow="md"
        >
          <Heading mb="20px" textAlign="center" fontSize="2xl">
            Your Projects
          </Heading>

          {/* CREATE PROJECT */}
          <Box bg="gray.50" p="20px" rounded="md" mb="30px" border="1px solid" borderColor="gray.200">
            <Text fontWeight="bold" mb="10px">
              Create New Project
            </Text>

            <VStack spacing={3}>
              <Input
                placeholder="Project Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                bg="white"
              />

              <Input
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                bg="white"
              />

              <Button colorScheme="blue" w="100%" onClick={createProject}>
                Create
              </Button>
            </VStack>
          </Box>

          {/* LOADING */}
          {loading && (
            <Center>
              <Spinner />
              <Text ml={3}>Loading...</Text>
            </Center>
          )}

          {/* PROJECT CARDS */}
          <SimpleGrid columns={[1, 2, 2]} spacing={6}>
            {projects.map((p) => (
              <Box
                key={p.id}
                p="20px"
                bg="gray.50"
                rounded="md"
                shadow="sm"
                border="1px solid"
                borderColor="gray.200"
                transition="0.2s"
                _hover={{ shadow: "md", transform: "scale(1.02)" }}
              >
                <HStack justify="space-between">
                  <Heading
                    size="md"
                    cursor="pointer"
                    onClick={() => navigate(`/project/${p.id}`)}
                  >
                    {p.title}
                  </Heading>

                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => deleteProject(p.id)}
                  >
                    Delete
                  </Button>
                </HStack>

                <Text mt={2} color="gray.600">
                  {p.description || "No description"}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {!loading && projects.length === 0 && (
            <Center mt={6}>
              <Text color="gray.500">You don't have any projects yet.</Text>
            </Center>
          )}
        </Box>
      </Box>
    </>
  );
}
