import { Loader2 } from "lucide-react";

export function Loader({ loaderText }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium text-white">{loaderText}...</p>
      </div>
    </div>
  );
}
