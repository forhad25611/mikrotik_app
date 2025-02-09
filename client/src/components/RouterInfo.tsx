import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { fetchRouterInfo } from "@/lib/mikrotik";

export default function RouterInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["router-info"],
    queryFn: fetchRouterInfo,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Router Information</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Router Information</CardTitle>
        </CardHeader>
        <CardContent>Error loading router info</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Router Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Identity:</strong> {data?.identity}</p>
          <p><strong>Version:</strong> {data?.version}</p>
        </div>
      </CardContent>
    </Card>
  );
}