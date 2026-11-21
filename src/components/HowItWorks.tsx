import { ClipboardCheck, Search, UserPlus, Send } from "lucide-react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    icon: UserPlus,
    title: "Create an account",
    text: "Sign up as a Student or a Tutor in less than a minute. Choose your role and set up your profile.",
  },
  {
    icon: Search,
    title: "Post or search",
    text: "Tutors publish batches with a banner and schedule. Students search by subject, level and mode.",
  },
  {
    icon: Send,
    title: "Apply for a tuition",
    text: "Students send an application with their phone, preferred schedule and a short learning note.",
  },
  {
    icon: ClipboardCheck,
    title: "Get accepted",
    text: "Tutors review applicants, accept the best fit and students track the status in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section className='py-16 md:py-20'>
      <Container>
        <SectionHeading
          title='How MentorLagbe Works'
          subtitle='Four simple steps for students and tutors, from first search to first class.'
        />
        <div className='relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block' />
          {steps.map((step, index) => (
            <div
              key={step.title}
              className='relative rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md'>
              <div className='relative mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-4 ring-background'>
                <step.icon className='h-6 w-6' />
                <span className='absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
                  {index + 1}
                </span>
              </div>
              <h3 className='text-lg font-semibold'>{step.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
