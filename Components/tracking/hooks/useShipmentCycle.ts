import { useMemo } from "react";

import { getCycleForShipment } from "@/lib/shipmentCycles";

export default function useShipmentCycle(
  shipmentType: string,
  containers: any[] = []
) {
  const cycle = getCycleForShipment(shipmentType);

  const completedKeys = useMemo(() => {
    const set = new Set<string>();

    for (const container of containers) {
      for (const ev of container.events ?? []) {
        if (ev.cycleStep) {
          set.add(`${ev.cycleStep}::${ev.eventType ?? "single"}`);
        }
      }
    }

    return set;
  }, [containers]);

  const phases = useMemo(() => {
    const map = new Map<string, any[]>();

    for (const step of cycle) {
      if (!map.has(step.phase)) {
        map.set(step.phase, []);
      }

      map.get(step.phase)!.push({
        ...step,
        etaDone: completedKeys.has(`${step.key}::eta`),
        actualDone: completedKeys.has(`${step.key}::actual`),
        singleDone: completedKeys.has(`${step.key}::single`),
      });
    }

    return Array.from(map.entries()).map(([name, steps]) => ({
      name,
      steps,
    }));
  }, [cycle, completedKeys]);

  const steps = useMemo(
    () =>
      cycle.map((step) => ({
        ...step,
        etaDone: completedKeys.has(`${step.key}::eta`),
        actualDone: completedKeys.has(`${step.key}::actual`),
        singleDone: completedKeys.has(`${step.key}::single`),
      })),
    [cycle, completedKeys]
  );

  return {
    phases,
    steps,
  };
}