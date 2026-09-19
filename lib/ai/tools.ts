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
