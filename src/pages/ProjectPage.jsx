import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASEURL from "../Base";

import {
  Box,
  Heading,
  Stack,
  Text,
  Divider,
  Input,
  Button,
  Checkbox,
  HStack,
} from "@chakra-ui/react";

import { toast } from "react-toastify";
import Navbar from "../navbar";
import ChatbaseWidget from "./ChatBaseWidget";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categoryTitle, setCategoryTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState({});

  async function loadProject() {
    setLoading(true);
    try {
      const res = await fetch(`${BASEURL}api/project/${id}/`, {
        credentials: "include",
      });
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.log("load project err", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProject();
  }, [id]);

  // ---------------- CATEGORY ----------------
  async function submitCategory() {
    if (!categoryTitle.trim()) return;

    try {
      const res = await fetch(`${BASEURL}api/project/${id}/create_category/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: categoryTitle }),
      });
      const newCat = await res.json();
      toast.success("Category created!");
      setCategoryTitle("");

      // add to state directly
      setProject((prev) => ({
        ...prev,
        categories: [...prev.categories, { ...newCat, tasks: [] }],
      }));
    } catch {
      toast.error("Failed to create category");
    }
  }

  async function deleteCategory(categoryId) {
    try {
      await fetch(`${BASEURL}api/project/category/${categoryId}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      toast.error("Category deleted");

      setProject((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== categoryId),
      }));
    } catch {
      toast.error("Failed to delete category");
    }
  }

  // ---------------- TASK ----------------
  async function submitTask(categoryId) {
    const title = taskInputs[categoryId];
    if (!title?.trim()) return;

    try {
      const res = await fetch(`${BASEURL}api/project/category/${categoryId}/create_task/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const newTask = await res.json();
      toast.success("Task added!");
      setTaskInputs((prev) => ({ ...prev, [categoryId]: "" }));

      setProject((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, tasks: [...cat.tasks, newTask] }
            : cat
        ),
      }));
    } catch {
      toast.error("Failed to add task");
    }
  }

  async function toggleTask(taskId, categoryId) {
    try {
      await fetch(`${BASEURL}api/project/task/${taskId}/toggle/`, {
        method: "PATCH",
        credentials: "include",
      });
      toast.info("Task updated");

      setProject((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                tasks: cat.tasks.map((t) =>
                  t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
                ),
              }
            : cat
        ),
      }));
    } catch {
      toast.error("Failed to toggle task");
    }
  }

  async function deleteTask(taskId, categoryId) {
    try {
      await fetch(`${BASEURL}api/project/task/${taskId}/delete/`, {
        method: "DELETE",
        credentials: "include",
      });
      toast.error("Task deleted");

      setProject((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                tasks: cat.tasks.filter((t) => t.id !== taskId),
              }
            : cat
        ),
      }));
    } catch {
      toast.error("Failed to delete task");
    }
  }

  if (loading) return <Text>Loading...</Text>;
  if (!project) return <Text>Project not found</Text>;

  return (
    <>
      <Navbar />
      <Box bg="gray.100" minH="100vh" py="40px">
        <Box maxW="900px" mx="auto" bg="white" p="28px" rounded="md" shadow="md">
          <Heading fontSize="2xl">{project.title}</Heading>
          <Text mt="8px" opacity={0.8}>{project.description}</Text>

          <Divider my="24px" />
          <Heading size="sm" mb="12px">Add Category</Heading>

          <Stack direction="row" mb="20px">
            <Input
              placeholder="Category name..."
              value={categoryTitle}
              onChange={(e) => setCategoryTitle(e.target.value)}
              bg="gray.50"
            />
            <Button colorScheme="blue" onClick={submitCategory}>Add</Button>
          </Stack>

          <Divider mb="24px" />
          <Heading size="md" mb="16px">Categories</Heading>

          {project.categories.length === 0 && <Text opacity={0.6}>No categories yet.</Text>}

          <Stack spacing="16px">
            {project.categories.map((cat) => (
              <Box key={cat.id} border="1px solid" borderColor="gray.200" p="16px" rounded="md" bg="gray.50">
                <HStack justify="space-between" mb="10px">
                  <Heading size="sm">{cat.title}</Heading>
                  <Button size="xs" colorScheme="red" variant="outline" onClick={() => deleteCategory(cat.id)}>Delete</Button>
                </HStack>

                {cat.tasks.length === 0 ? (
                  <Text opacity={0.6} mb="10px">No tasks yet.</Text>
                ) : (
                  <Stack mb="12px">
                    {cat.tasks.map((task) => (
                      <HStack key={task.id} justify="space-between" p="8px" bg="white" border="1px solid" borderColor="gray.200" rounded="md">
                        <Checkbox
                          isChecked={task.is_completed}
                          onChange={() => toggleTask(task.id, cat.id)}
                        >
                          {task.title}
                        </Checkbox>
                        <Button size="xs" colorScheme="red" onClick={() => deleteTask(task.id, cat.id)}>Delete</Button>
                      </HStack>
                    ))}
                  </Stack>
                )}

                <Stack direction="row">
                  <Input
                    placeholder="New task..."
                    value={taskInputs[cat.id] || ""}
                    onChange={(e) => setTaskInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                  />
                  <Button colorScheme="green" onClick={() => submitTask(cat.id)}>Add</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
      <ChatbaseWidget />
    </>
  );
}
