import { Loader2 } from "lucide-react";

export default function Loader({ full }: { full?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center ${full ? "min-h-screen" : "min-h-[40vh]"}`}>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
    </div>
  );
}
