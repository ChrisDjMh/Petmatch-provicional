import React from "react";
import { EntrevistasLista } from "../src/components/EntrevistasLista";
import { Header, Screen } from "../src/components/ui";

export default function Entrevistas() {
  return (
    <Screen>
      <Header title="Mis entrevistas" />
      <EntrevistasLista />
    </Screen>
  );
}
