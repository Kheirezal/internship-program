import { useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { mockPlacements } from "@/data/mockData";

export function useAdvisorScope() {
  const { user } = useAuthStore();
  const advisorId = user?.id;

  const myPlacements = useMemo(
    () => mockPlacements.filter((p) => !advisorId || p.advisorId === advisorId),
    [advisorId]
  );

  const myPlacementIds = useMemo(() => myPlacements.map((p) => p.id), [myPlacements]);

  return { user, advisorId, myPlacements, myPlacementIds };
}
