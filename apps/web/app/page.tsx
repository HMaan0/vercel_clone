"use client";

import { Button } from "../components/Button";

export default function Home() {
  function newInstance() {}
  return (
    <>
      <Button onClick={newInstance}>lunch EC2</Button>
    </>
  );
}
