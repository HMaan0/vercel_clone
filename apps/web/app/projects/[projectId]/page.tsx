import Input from "../../../components/Input";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const projectId = (await params).projectId;

  return (
    <>
      <Input projectId={projectId} />
    </>
  );
};

export default page;
