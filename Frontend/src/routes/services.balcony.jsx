import React from "react";
import { createFileRoute } from "../lib/router";
import { ServiceDetail } from "../components/site/ServiceDetail";
import balcony from "../assets/balcony.jpg";
const Route = createFileRoute("/services/balcony")({
  head: () => ({
    meta: [
      { title: "Balcony Makeovers \u2014 Yogini Planters" },
      { name: "description", content: "Transform balconies into peaceful, pollution-resistant green lifestyle spaces." },
      { property: "og:image", content: balcony }
    ]
  }),
  component: () => <ServiceDetail
    slug="balcony-makeovers"
    eyebrow="Balcony makeover"
    title="Balcony Makeovers"
    intro="Transforming balconies into beautiful green lifestyle spaces that feel peaceful, relaxing, and visually elegant — designed for your sunlight, wind, and pollution conditions."
    image={balcony}
    provide={["Balcony design planning", "Plant arrangement styling", "Vertical garden ideas", "Decorative planter setup", "Seating greenery concepts", "Space optimization", "Installation support"]}
    sections={[
      { title: "Designed around your conditions", bullets: ["Sunlight exposure", "Wind conditions", "Vehicle pollution exposure", "Dust levels", "Temperature", "Space size", "Apartment or villa environment"] },
      { title: "Pollution-resistant selection", note: "For balconies exposed to traffic, vehicle smoke, dust and heat, we recommend stronger plants that tolerate environmental stress while still keeping the balcony fresh and visually attractive.", bullets: ["Relaxing green spaces", "Functional layouts", "Healthy plant environments", "Easy maintenance solutions", "Elegant green aesthetics"] }
    ]}
  />
});
export {
  Route
};
