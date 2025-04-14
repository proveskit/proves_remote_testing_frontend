import { z } from "zod";

export const LogSchema = z
  .object({
    msg: z.string(),
    time: z.string(),
    level: z.enum(["NOTSET", "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]),
  })
  .catchall(z.any());

export type Log = z.infer<typeof LogSchema>;
