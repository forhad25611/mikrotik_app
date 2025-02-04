import { useQuery } from "@tanstack/react-query";
import { getRouterInfo, type RouterInfo as RouterInfoType } from "@/lib/mikrotik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CpuIcon, ClockIcon, HardDriveIcon, ActivityIcon, ServerIcon } from "lucide-react";

interface RouterInfoProps {
  ip: string;
}

export function RouterInfo({ ip }: RouterInfoProps) {
  const { data, isLoading } = useQuery<RouterInfoType>({
    queryKey: ["/api/router/info", ip],
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
    return <div>No data available</div>;
  }

  const stats = [
    {
      icon: ServerIcon,
      label: "Identity",
      value: data.identity,
    },
    {
      icon: ActivityIcon,
      label: "Version",
      value: data.version,
    },
    {
      icon: ClockIcon,
      label: "Uptime",
      value: data.uptime,
    },
    {
      icon: CpuIcon,
      label: "CPU Load",
      value: data.cpuLoad,
    },
    {
      icon: HardDriveIcon,
      label: "Memory Used",
      value: data.memoryUsed,
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}