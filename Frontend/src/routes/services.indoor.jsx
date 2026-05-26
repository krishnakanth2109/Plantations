import React from "react";
import { createFileRoute } from "../lib/router";
import { ServiceDetail } from "../components/site/ServiceDetail";
import indoor from "../assets/indoor.jpg";
const Route = createFileRoute("/services/indoor")({
  head: () => ({
    meta: [
      { title: "Indoor Plant Styling \u2014 Yogini Planters" },
      { name: "description", content: "Personalized indoor plant styling planned for room temperature, lighting, AC, and lifestyle." },
      { property: "og:image", content: indoor }
    ]
  }),
  component: () => <ServiceDetail
    slug="indoor-plant-styling"
    eyebrow="Indoor styling"
    title="Indoor Plant Styling"
    intro="We don't simply place plants — we carefully select them based on room environment, temperature, lighting, furniture, ventilation, and the purpose of the space. Recommendations are personalized to ensure both aesthetics and long-term plant health."
    image={indoor}
    provide={[
      "Plant selection",
      "Space analysis",
      "Pot and planter selection",
      "Indoor styling consultation",
      "Plant placement planning",
      "Installation setup",
      "Low-maintenance plant solutions"
    ]}
    sections={[
      {
        title: "Our approach",
        note: "Plant selection is carefully planned based on:",
        bullets: ["Room temperature", "Natural & artificial lighting", "Air circulation", "AC or non-AC environment", "Interior furniture", "Space layout", "Usage of the room", "D\xE9cor style", "Daily activities"]
      },
      { title: "Living Room", bullets: ["Sofa & furniture arrangement", "Spaciousness", "Lighting availability", "Decorative interiors", "AC environment", "Natural airflow"] },
      { title: "Bedroom", bullets: ["Calm, relaxing atmosphere", "Air quality improvement", "Low maintenance", "Night-friendly conditions", "Soft styling concepts"] },
      { title: "Kitchen", bullets: ["Heat & temperature", "Ventilation", "Humidity", "Available sunlight", "Functional kitchen layout"] },
      { title: "Bathroom", bullets: ["Moisture & humidity", "Low-light conditions", "Ventilation", "Compact space styling"] },
      { title: "Workspace & Study", bullets: ["Bookshelves & furniture", "Work environment", "Lighting conditions", "AC exposure", "Focus & productivity"] },
      { title: "Air-purifying recommendations", bullets: ["Reduce indoor pollutants", "Improve freshness", "Create calming atmosphere", "Enhance wellness & comfort"] }
    ]}
  />
});
export {
  Route
};
