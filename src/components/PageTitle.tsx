export default function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {title}
        </h1>
        {description && (
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
