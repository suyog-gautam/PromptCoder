import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, UserPlus, Search, Check } from "lucide-react";
import { UseUserContext } from "../../context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "../../config/axios";
import { data } from "react-router-dom";
import { set } from "react-hook-form";
export function UserList({ project }) {
  const { allUsers, getAllUsers, getProjectDetails } = UseUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, []);
  const filteredUsers = searchTerm
    ? allUsers.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  const handleAddCollaborator = async () => {
    if (selectedUser) {
      try {
        const { data } = await axiosInstance.put(`/projects/addCollaborator`, {
          projectId: project._id,
          collaboratorId: selectedUser._id,
        });
        if (data.success) {
          toast.success("Collaborator added successfully");
          getProjectDetails(project._id);
          setIsDialogOpen(false);
          setSelectedUser(null);
          setSearchTerm("");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else {
          toast.error(error.response || "Failed to add collaborator");
        }
        console.error(error);
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="pt-6 space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Project Members</h2>

          <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            className="bg-black"
          >
            <DialogTrigger asChild>
              <UserPlus className="h-5 w-5 text-slate-200 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-700 text-slate-200">
              <DialogHeader>
                <DialogTitle>Add Collaborator</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-slate-900"
                  />
                </div>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center justify-between p-2 cursor-pointer rounded-md ${
                        selectedUser?._id === user._id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-slate-900"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {selectedUser?._id === user._id && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <Button
                onClick={handleAddCollaborator}
                disabled={!selectedUser}
                className="bg-slate-900 text-white"
              >
                Add Collaborator
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        {project.users.map((user, index) => (
          <div key={index} className="flex items-center space-x-2">
            <User className="h-6 w-6 text-slate-200" />
            <span>{user.email}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
