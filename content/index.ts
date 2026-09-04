import site from "./site.json";
import intro from "./intro.json";
import room from "./room.json";
import computer from "./computer.json";
import books from "./books.json";
import drawer from "./drawer.json";
import notebook from "./notebook.json";
import board from "./board.json";
import fieldCase from "./field-case.json";
import faxContact from "./fax-contact.json";
import references from "./references.json";
import packageMetadata from "../package.json";

const version = `v${packageMetadata.version}`;
const siteWithVersion = {
  ...site,
  brand: { ...site.brand, version: `PORTFOLIO SYSTEM ${version}` },
};
const faxContactWithVersion = {
  ...faxContact,
  contact: {
    ...faxContact.contact,
    feedback: faxContact.contact.feedback.replace("{version}", version),
    feedbackLabel: faxContact.contact.feedbackLabel.replace("{version}", packageMetadata.version),
  },
};

export {
  siteWithVersion as site,
  intro,
  room,
  computer,
  books,
  drawer,
  notebook,
  board,
  fieldCase,
  faxContactWithVersion as faxContact,
  references,
};
