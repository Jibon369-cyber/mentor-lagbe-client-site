import { ClipboardCheck, Search, UserPlus, Send } from "lucide-react";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    icon: UserPlus,
    title: "Create an account",
    text: "Sign up as a Student or a Tutor in less than a minute.",
  },
  {
    icon: Search,
    title: "Post or Search",
    text: "Tutors post their batches. Students search by subject, level and mode.",
  },
  {
    icon: Send,
    title: "Apply for a tuition",
    text: "Students send an application with their preferred schedule.",
  },
  {
    icon: ClipboardCheck,
    title: "Get accepted",
    text: "Tutors review applicants and accept the best fit.",
  },
];

export default function HowItWorks() {
  return (
    <section className='py-16'>
      <Container>
        <SectionHeading
          title='How MentorLagbe Works'
          subtitle='Four simple steps for students and tutors.'
        />
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className='rounded-xl border bg-card p-6 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <step.icon className='h-6 w-6' />
              </div>
              <p className='text-sm font-semibold text-primary'>
                Step {index + 1}
              </p>
              <h3 className='mt-1 text-lg font-semibold'>{step.title}</h3>
              <p className='mt-2 text-sm text-muted-foreground'>{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
