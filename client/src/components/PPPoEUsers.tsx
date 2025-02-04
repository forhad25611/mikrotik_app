import { useQuery } from "@tanstack/react-query";
import { getPPPoEUsers, type PPPoEUserStatus } from "@/lib/mikrotik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WifiIcon, RefreshCcwIcon, SignalIcon, ClockIcon, PhoneIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PPPoEUsersProps {
  ip: string;
}

function StatusIndicator({ isOnline, uptime }: { isOnline: boolean; uptime?: string }) {
  let statusColor = "bg-red-500";
  let statusText = "Offline";
  let tooltipText = "User is currently offline";

  if (isOnline) {
    const uptimeHours = uptime ? parseInt(uptime.split(':')[0]) : 0;
    if (uptimeHours >= 24) {
      statusColor = "bg-green-500";
      statusText = "Stable";
      tooltipText = `Connected for ${uptime}`;
    } else if (uptimeHours >= 1) {
      statusColor = "bg-blue-500";
      statusText = "Online";
      tooltipText = `Connected for ${uptime}`;
    } else {
      statusColor = "bg-yellow-500";
      statusText = "Recent";
      tooltipText = "Recently connected";
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${statusColor} animate-pulse`} />
            <span className="text-sm font-medium">{statusText}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PPPoEUsers({ ip }: PPPoEUsersProps) {
  const { data, isLoading, refetch, isFetching } = useQuery<PPPoEUserStatus[]>({
    queryKey: [`/api/router/pppoe-users?ip=${encodeURIComponent(ip)}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!data) {
    return <div>No PPPoE users data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">PPPoE Users Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcwIcon className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((user) => (
          <Card key={user.username} className={`
            transition-shadow duration-200
            ${user.isOnline ? 'shadow-md hover:shadow-lg' : 'opacity-75'}
          `}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <SignalIcon className={`h-4 w-4 ${user.isOnline ? 'text-green-500' : 'text-red-500'}`} />
                <span>{user.username}</span>
              </CardTitle>
              <StatusIndicator isOnline={user.isOnline} uptime={user.uptime} />
            </CardHeader>
            <CardContent>
              {user.isOnline && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <WifiIcon className="h-4 w-4" />
                    IP: {user.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    Uptime: {user.uptime}
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Caller ID: {user.callerId || 'N/A'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}