import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Log } from "@/types/LogTypes";
import { IoChevronDownOutline } from "react-icons/io5";

const omit = (obj: object, arr: unknown[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));

export function FormattedLog({ log, idx }: { log: Log; idx: number }) {
  const extraParams = omit(log, ["msg", "time", "level"]);

  return (
    <div
      className={`w-full min-h-14 flex items-center px-3 ${
        log.level === "ERROR" ? "bg-red-200" : ""
      }`}
    >
      <div className="flex items-center w-full">
        <div className="flex-shrink-0 w-8">
          <p className="font-mono text-sm">{idx + 1}</p>
        </div>

        <div className="flex-grow max-w-[60%]">
          <p className="font-mono text-sm">{log.msg}</p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
          {Object.entries(extraParams).length > 0 && (
            <Popover>
              <PopoverTrigger className="flex items-center gap-1 hover:cursor-pointer bg-gray-100 py-1.5 px-2 rounded-sm w-36">
                <IoChevronDownOutline size={12} />
                <p className="text-sm">Show Extra Data</p>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex items-center gap-2 flex-col h-75 overflow-scroll">
                  {Object.entries(extraParams).map(([k, v]) => (
                    <div
                      key={k}
                      className="bg-neutral-200 p-1 rounded-md w-full"
                    >
                      <p className="font-bold">{k}</p>
                      <p>{v}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <p className="text-neutral-600 text-sm w-24 text-right">{log.time}</p>
        </div>
      </div>
    </div>
  );
}
