export const chatTools = [
  {
    type: "function",
    function: {
      name: "get_services",
      description: "Palauta yrityksen palvelut ja hinnat tietokannasta.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Hae 3-6 vapaata aikaa Google-kalenterista. Kayta ennen kuin ehdotat aikoja.",
      parameters: {
        type: "object",
        properties: {
          duration_min: { type: "number" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking",
      description: "Varaa aika vasta kun asiakas on valinnut slotin ja antanut nimen seka puhelimen.",
      parameters: {
        type: "object",
        properties: {
          starts_at: { type: "string", description: "ISO-aika check_availability-vastauksesta" },
          duration_min: { type: "number" },
          service_name: { type: "string" },
          customer_name: { type: "string" },
          customer_phone: { type: "string" },
          customer_email: { type: "string" },
        },
        required: ["starts_at", "customer_name", "customer_phone"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_lead",
      description: "Tallenna liidi vasta kun sinulla on nimi ja puhelinnumero.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          interest: { type: "string" },
        },
        required: ["name", "phone"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalate",
      description: "Merkitse keskustelu handoffiksi kun asiakas pyytaa ihmista tai et osaa auttaa.",
      parameters: {
        type: "object",
        properties: { reason: { type: "string" } },
        required: ["reason"],
        additionalProperties: false,
      },
    },
  },
];
