import React from "react";
import { createFileRoute } from "../lib/router";
import { ServiceDetail } from "../components/site/ServiceDetail";
import landscape from "../assets/landscape.jpg";
const Route = createFileRoute("/services/landscaping")({
  head: () => ({
    meta: [
      { title: "Landscaping Services \u2014 Yogini Planters" },
      { name: "description", content: "Professional landscaping for residential and commercial spaces." },
      { property: "og:image", content: landscape }
    ]
  }),
  component: () => <ServiceDetail
    slug="landscaping"
    eyebrow="Landscaping"
    title="Landscaping Services"
    intro="Professional landscaping solutions for residential and commercial spaces — designed to create functional and aesthetic outdoor environments."
    image={landscape}
    provide={["Landscape planning", "Garden design", "Plant selection", "Outdoor styling", "Green space development", "Lawn & garden enhancement", "Customized landscape concepts"]}
  />
});
export {
  Route
};
