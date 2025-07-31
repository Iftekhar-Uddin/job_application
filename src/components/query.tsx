import { prisma } from "@/providers/prisma";

const query = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { postedBy: true },
  });
  return job;
};

export default query;
