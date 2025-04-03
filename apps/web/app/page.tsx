import WsClient from "../components/WsClient";

export default function Home() {
  function newInstance() {}
  return (
    <>
      {/* <Button onClick={newInstance}>lunch EC2</Button> */}
      <WsClient />
    </>
  );
}
