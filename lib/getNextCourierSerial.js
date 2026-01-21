import Counter from "@/models/Counter";

export async function getNextCourierSerial(entryType) {
  const counter = await Counter.findOneAndUpdate(
    { key: `courier-${entryType}` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return counter.value;
}
