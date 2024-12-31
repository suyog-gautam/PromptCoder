import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UseUserContext } from "../../context/UserContext";
import { toast } from "sonner";
import MessageBox from "@/components/MessageBox";
import axiosInstance from "../../config/axios";

const Project = () => {
  const { projectId } = useParams();

  const { getProjectDetails, project } = UseUserContext();
  useEffect(() => {
    getProjectDetails(projectId);
  }, [projectId]);

  return (
    <>
      <MessageBox projects={project} />
    </>
  );
};

export default Project;
