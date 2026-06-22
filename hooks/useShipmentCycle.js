/**
 * useShipmentCycle
 *
 * React hook that drives the cycle-aware "Add Container Status" form.
 *
 * Usage:
 *   const { phases, steps, selectedStep, selectStep, needsContainer } =
 *     useShipmentCycle(job.shipmentType, job.containers);
 */

import { useMemo, useState } from "react";
import {
    getCycleForShipment,
    PRE_CONTAINER_SENTINEL,
} from "@/lib/shipmentCycles";

// Re-export sentinel so form components don't need to import from two places
export { PRE_CONTAINER_SENTINEL };

/**
 * @param {"import"|"export"|null} shipmentType
 * @param {Array} containers  — job.containers from DB
 */
export function useShipmentCycle(shipmentType, containers = []) {
    const cycle = getCycleForShipment(shipmentType);
    const [selectedStepKey, setSelectedStepKey] = useState(null);

    // ── Build set of already-completed (step+eventType) keys ────
    const completedKeys = useMemo(() => {
        const set = new Set();
        for (const container of containers) {
            for (const ev of container.events ?? []) {
                if (ev.cycleStep) {
                    set.add(`${ev.cycleStep}::${ev.eventType ?? "single"}`);
                }
            }
        }
        return set;
    }, [containers]);

    // ── Group steps by phase ─────────────────────────────────────
    const phases = useMemo(() => {
        const map = new Map();
        for (const step of cycle) {
            if (!map.has(step.phase)) map.set(step.phase, []);
            map.get(step.phase).push({
                ...step,
                // Mark ETA and Actual variants independently
                etaDone: completedKeys.has(`${step.key}::eta`),
                actualDone: completedKeys.has(`${step.key}::actual`),
                singleDone: completedKeys.has(`${step.key}::single`),
            });
        }
        return Array.from(map.entries()).map(([name, steps]) => ({ name, steps }));
    }, [cycle, completedKeys]);

    // ── Flat list of steps (for simple iteration) ────────────────
    const steps = useMemo(() => cycle.map((s) => ({
        ...s,
        etaDone: completedKeys.has(`${s.key}::eta`),
        actualDone: completedKeys.has(`${s.key}::actual`),
        singleDone: completedKeys.has(`${s.key}::single`),
    })), [cycle, completedKeys]);

    const selectedStep = steps.find((s) => s.key === selectedStepKey) ?? null;

    /**
     * Whether the selected step requires a real container number.
     * Returns false for pre-container steps.
     */
    const needsContainer = selectedStep?.requiresContainer ?? false;

    /**
     * Whether the selected step is where the container number gets assigned.
     * The form should show a "Container Number" input for this step.
     */
    const assignsContainer = selectedStep?.assignsContainer ?? false;

    /**
     * Determine which date inputs to show based on the selected step.
     * Returns one of: "single" | "eta" | "actual" | "both" | null
     */
    const dateMode = selectedStep?.dateFields ?? null;

    return {
        /** All phases with their steps (for rendering grouped UI) */
        phases,
        /** Flat step list */
        steps,
        /** Currently selected step definition (or null) */
        selectedStep,
        /** Key of the currently selected step */
        selectedStepKey,
        /** Call to select a step by key */
        selectStep: setSelectedStepKey,
        /** Does the selected step need a container number? */
        needsContainer,
        /** Does this step assign the container number for the first time? */
        assignsContainer,
        /** Which date pickers to render: "single"|"eta"|"actual"|"both" */
        dateMode,
        /** The effective containerNumber to send to the API */
        resolveContainerNumber(typedContainerNumber) {
            if (!needsContainer) return PRE_CONTAINER_SENTINEL;
            return typedContainerNumber ?? "";
        },
    };
}