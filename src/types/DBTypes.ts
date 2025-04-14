export type Deployment = {
  id: number;
  created_at: Date;
  action_id: string;
  in_progress: boolean;
  success?: boolean;
  pr_repo: string;
  pr_repo_owner: string;
  pr_name: string;
  pr_branch: string;
  pr_number: number;
  pr_author: string;
};
