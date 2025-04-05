import WsClient from "../../components/WsClient";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const projectId = (await params).projectId;
  return (
    <>
      <WsClient projectId={projectId} />
    </>
  );
};

export default page;
