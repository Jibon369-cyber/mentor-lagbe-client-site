// Same heading style for every section of the site
export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className='mx-auto mb-10 max-w-2xl text-center'>
      <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
      {subtitle && <p className='mt-3 text-muted-foreground'>{subtitle}</p>}
    </div>
  );
}
