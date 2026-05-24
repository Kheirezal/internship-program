import { useState } from "react";
import { mockAdvisorFollowUps } from "@/data/mockData";
import { useAdvisorScope } from "./useAdvisorScope";
import AdvisorFollowUpTab from "@/pages/advisor/AdvisorFollowUpTab";

export default function AdvisorFollowUpsPage() {
  const { myPlacements, myPlacementIds } = useAdvisorScope();
  const [followUps, setFollowUps] = useState(() =>
    mockAdvisorFollowUps.filter((f) => myPlacementIds.includes(f.placementId))
  );

  return (
    <AdvisorFollowUpTab
      followUps={followUps}
      onFollowUpsChange={setFollowUps}
      myPlacements={myPlacements}
    />
  );
}
