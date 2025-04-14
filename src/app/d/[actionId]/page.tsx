import CardWrapper from "@/components/CardWrapper";
import { FormattedLog } from "@/components/FormattedLog";
import { getDeployment } from "@/data/db";
import { getS3LogsObject } from "@/data/s3";
import { Log } from "@/types/LogTypes";
import Image from "next/image";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { FaCheck, FaRegCalendar, FaTimes } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";
import { LuGitBranch } from "react-icons/lu";
import { MdKeyboardArrowLeft } from "react-icons/md";

export default async function DeploymentPage({
  params,
}: {
  params: Promise<{ actionId: string }>;
}) {
  const { actionId } = await params;

  const deployment = await getDeployment(actionId);
  if (!deployment) {
    return <div>Deployment not found</div>;
  }

  const avatarUrl = `https://api.github.com/users/${deployment.pr_author}`;
  const avatarResponse = await fetch(avatarUrl);
  const avatarData = await avatarResponse.json();

  const logsArray = await getS3LogsObject(`${actionId}.json`);

  return (
    <div className="p-3 w-full">
      <Link
        href={"/"}
        className="flex items-center rounded-md text-neutral-600 hover:text-neutral-800 transition-colors w-fit select-none mb-2"
      >
        <MdKeyboardArrowLeft size={24} />
        <p>Go back to deployments</p>
      </Link>
      <div className="w-full flex items-center justify-between mb-2">
        <p className="text-3xl font-bold">
          <span className="text-4xl">#{deployment.pr_number}</span>{" "}
          {deployment.pr_name}
        </p>
        <div className="flex-grow flex items-center"></div>
        <Link
          target="_blank"
          href={`https://github.com/${deployment.pr_repo}/pull/${deployment.pr_number}/checks?check_run_id=${deployment.action_id}`}
          className="flex items-center gap-1 text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          <BiLinkExternal size={20} />
          <p>View on GitHub</p>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {deployment.in_progress ? (
          <CardWrapper bgColor="bg-blue-200">
            <ImSpinner11 size={14} className="animate-spin" />
            <p className="text-sm">In Progress</p>
          </CardWrapper>
        ) : (
          <CardWrapper
            bgColor={deployment.success ? "bg-green-200" : "bg-red-200"}
          >
            {deployment.success ? <FaCheck size={14} /> : <FaTimes size={14} />}
            <p className="text-sm">
              {deployment.success ? "Passed" : "Failed"}
            </p>
          </CardWrapper>
        )}
        <CardWrapper>
          <FaRegCalendar size={14} />
          <p className="text-sm">{deployment.created_at.toLocaleString()}</p>
        </CardWrapper>
        <CardWrapper>
          <Image
            src={avatarData.avatar_url}
            className="w-4 h-4 rounded-full"
            alt="PR author profile picture"
            width={22}
            height={22}
          />
          <p className="text-sm">{deployment.pr_author}</p>
        </CardWrapper>
        <CardWrapper>
          <LuGitBranch size={14} />
          <p className="text-sm">{deployment.pr_branch}</p>
        </CardWrapper>
      </div>
      <div className="flex flex-col gap-1">
        {logsArray?.map((log: Log, idx: number) => (
          <FormattedLog key={idx} log={log} idx={idx} />
        ))}
      </div>
    </div>
  );
}
