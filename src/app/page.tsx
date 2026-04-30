import { AppLayout } from "@/features/app-shell/AppLayout";
import { CampaignTable } from "@/features/campaigns";

export default function Home() {
  return (
    <AppLayout>
      <CampaignTable />
    </AppLayout>
  );
}
