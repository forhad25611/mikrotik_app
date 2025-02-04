import { useQuery } from "@tanstack/react-query";
import { getPPPoEUsers, type PPPoEUserStatus } from "@/lib/mikrotik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WifiIcon, RefreshCcwIcon } from "lucide-react";

interface PPPoEUsersProps {
  ip: string;
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

      <div className="space-y-4">
        {data.map((user) => (
          <Card key={user.username}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.username}
              </CardTitle>
              <WifiIcon 
                className={`h-4 w-4 ${user.isOnline ? 'text-green-500' : 'text-red-500'}`} 
              />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {user.isOnline ? 'Online' : 'Offline'}
              </div>
              {user.isOnline && (
                <div className="text-sm text-muted-foreground">
                  <p>Uptime: {user.uptime}</p>
                  <p>IP: {user.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}