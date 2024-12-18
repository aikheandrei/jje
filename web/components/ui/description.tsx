"use client";

import { DescriptionProps } from "@/types/props";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { DescriptionModal } from "../admin/description-modal";

const Description: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const [descriptionsData, setDescriptionsData] = useState<DescriptionProps[]>(
    [],
  );

  const fetchDescriptions = async () => {
    const descriptions: DescriptionProps[] = await fetch(
      `/api/descriptions`,
    ).then((res) => res.json());
    descriptions ? setDescriptionsData(descriptions) : [];
  };

  useEffect(() => {
    fetchDescriptions();
  }, []);

  const deleteDescription = async (title: string) => {
    await fetch(`/api/descriptions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });
  };

  return (
    <>
      {descriptionsData.map(
        ({ id, title, description, createdAt, updatedAt }, index) => (
          <div className="text-sm" key={index}>
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{createdAt}</p>
            <p>{updatedAt}</p>
            {isAdmin && (
              <div className="space-x-2 font-geistsans">
                <DescriptionModal
                  request="PUT"
                  id={id}
                  title={title}
                  description={description}
                >
                  Edit
                </DescriptionModal>
                <Button onClick={() => deleteDescription(title)}>Delete</Button>
              </div>
            )}
          </div>
        ),
      )}
    </>
  );
};

export { Description };
