import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = { title: string; value: string | number; icon: LucideIcon };

export default function StatCard({ title, value, icon: Icon }: Props) {
  return (
    <Card>
      <CardContent className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>{title}</p>
          <p className='mt-1 text-2xl font-bold capitalize'>{value}</p>
        </div>
        <div className='rounded-lg bg-primary/10 p-3 text-primary'>
          <Icon className='h-6 w-6' />
        </div>
      </CardContent>
    </Card>
  );
}
