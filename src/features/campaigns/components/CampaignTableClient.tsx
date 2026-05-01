"use client";

import { CampaignTable } from "./CampaignTable";
import { useRouter } from "next/navigation";
import { Campaign } from "../types";

type Props = {
  campaigns: Campaign[];
};

export default function CampaignTableClient({ campaigns }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    console.log("delete", id);

    // later:
    // await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    // router.refresh()
  };

  return <CampaignTable campaigns={campaigns} onDelete={handleDelete} />;
}
