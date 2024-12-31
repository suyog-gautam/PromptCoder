"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderSymlink, Users, Plus, Search } from "lucide-react";
import { UseUserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../config/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getProjects = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/projects/getAll`);
      if (data.success) {
        setAllProjects(data.projects);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch projects");
    }
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const { data } = await axiosInstance.post("/projects/create", {
        name: projectName,
      });

      if (data.success) {
        toast.success("Project created successfully");
        setIsOpen(false);
        setProjectName("");
        getProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">My Projects</h1>
          <div className="flex items-center space-x-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter the name for your new project.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="">
                      <Label htmlFor="project-name" className="text-right ">
                        Project Name
                      </Label>
                      <Input
                        id="project-name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="col-span-3 bg-gray-700 text-white mt-1 border-gray-600 focus:border-blue-500"
                        minLength={3}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project) => (
            <Card
              key={project._id}
              className="bg-gray-800 border-gray-700 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <CardHeader className="bg-gray-750 border-b border-gray-700">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <FolderSymlink className="mr-2 h-5 w-5 text-blue-400" />
                  {project.name}
                </CardTitle>
              </CardHeader>

              <CardFooter className="bg-gray-750 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="mr-2 h-4 w-4 text-blue-400" />
                  <span>
                    {project.users.length} collaborator
                    {project.users.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
