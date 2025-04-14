import CardWrapper from "@/components/CardWrapper";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getDeployments, getDeploymentsRowCount } from "@/data/db";
import { Deployment } from "@/types/DBTypes";
import Link from "next/link";
import { ImCheckmark, ImCross, ImSpinner11 } from "react-icons/im";
import { IoPerson } from "react-icons/io5";
import { LuGitBranch } from "react-icons/lu";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const rowCount = await getDeploymentsRowCount();
  const pageCount = Math.ceil(rowCount / 20);

  const pageParam = parseInt((await searchParams).page);
  const currentPage = isNaN(pageParam) ? 1 : pageParam;

  const deployments = await getDeployments(currentPage);

  return (
    <div className="p-3 w-full h-[calc(100vh-4rem)] flex flex-col">
      <p className="font-bold text-4xl mb-2">Deployments</p>
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-md border border-neutral-300 p-2 mb-2"
      />
      <div className="flex-1 overflow-auto border rounded-md p-1">
        <div className="flex flex-col gap-2">
          {deployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-1.5 mt-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 && (
                <PaginationPrevious href={`/?page=${currentPage - 1}`} />
              )}
            </PaginationItem>
            {paginationArray({ pageCount }).map((page: number | string) => (
              <PaginationItem key={page}>
                <PaginationPageItem
                  page={page}
                  currentPage={currentPage}
                  pageCount={pageCount}
                />
              </PaginationItem>
            ))}
            <PaginationItem>
              {currentPage < pageCount && (
                <PaginationNext href={`/?page=${currentPage + 1}`} />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function DeploymentCard({ deployment }: { deployment: Deployment }) {
  return (
    <Link
      href={`/d/${deployment.action_id}`}
      className="flex items-center justify-between gap-2 hover:bg-neutral-100 transition-colors rounded-md p-2"
    >
      <div className="flex items-center gap-2">
        <StatusIcon deployment={deployment} />
        <p className="font-bold">
          #{deployment.pr_number} - {deployment.pr_name}
        </p>
      </div>
      <div className="flex flex-grow items-center gap-2">
        <CardWrapper>
          <IoPerson size={14} />
          <p className="text-sm">{deployment.pr_author}</p>
        </CardWrapper>
        <CardWrapper>
          <LuGitBranch size={14} />
          <p className="text-sm">{deployment.pr_branch}</p>
        </CardWrapper>
      </div>
      <div className="flex items-center gap-2">
        <p>{deployment.created_at.toLocaleString()}</p>
      </div>
    </Link>
  );
}

function StatusIcon({ deployment }: { deployment: Deployment }) {
  if (deployment.in_progress)
    return <ImSpinner11 size={14} className="animate-spin" color="blue" />;
  if (deployment.success) return <ImCheckmark size={14} color="green" />;
  return <ImCross size={14} color="red" />;
}

function paginationArray({ pageCount }: { pageCount: number }) {
  if (pageCount > 4) {
    return [1, 2, "...", pageCount - 1, pageCount];
  }

  return Array.from({ length: pageCount }, (_, i) => i + 1);
}

function PaginationPageItem({
  page,
  currentPage,
  pageCount,
}: {
  page: number | string;
  currentPage: number;
  pageCount: number;
}) {
  if (page === "..." && !paginationArray({ pageCount }).includes(currentPage)) {
    return (
      <PaginationLink href={`/?page=${currentPage}`} isActive>
        {currentPage}
      </PaginationLink>
    );
  }

  if (page === "...") return <PaginationEllipsis />;

  return (
    <PaginationLink href={`/?page=${page}`} isActive={page === currentPage}>
      {page}
    </PaginationLink>
  );
}
